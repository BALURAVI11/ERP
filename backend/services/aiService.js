const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Document } = require("langchain/document");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Invoice = require("../models/Invoice");

// Singleton in-memory vector database
let vectorStore = null;

// [R] Retrieval Prep: Pull live data from MongoDB and embed it into the Vector Database
const initializeVectorDatabase = async () => {
  if (vectorStore) return vectorStore; // Return cached DB if already built
  
  console.log("--> [RAG] Initializing Vector Database...");
  
  try {
    // 1. Fetch live records from MongoDB
    const products = await Product.find({});
    const suppliers = await Supplier.find({});
    const invoices = await Invoice.find({ status: 'Pending' }).populate('customer', 'name');

    const documents = [];

    // 2. Convert database records into readable text documents
    products.forEach(p => {
      documents.push(new Document({
        pageContent: `Product Name: ${p.title}. SKU: ${p.sku}. Category: ${p.category}. Price: ₹${p.price}. Current Stock: ${p.stock}. Reorder Level: ${p.reorderLevel}. Description: ${p.description}`,
        metadata: { type: 'product', id: p._id.toString() }
      }));
    });

    suppliers.forEach(s => {
      documents.push(new Document({
        pageContent: `Supplier Name: ${s.name}. Contact Person: ${s.contactPerson}. Email: ${s.email}. Phone: ${s.phone}. Status: ${s.status}. Address: ${s.address}`,
        metadata: { type: 'supplier', id: s._id.toString() }
      }));
    });

    invoices.forEach(i => {
      documents.push(new Document({
        pageContent: `Pending Invoice. Invoice Number: ${i.invoiceNumber}. Customer Name: ${i.customer?.name || 'Unknown'}. Total Amount: ₹${i.totalAmount}. Due Date: ${new Date(i.dueDate).toLocaleDateString()}.`,
        metadata: { type: 'invoice', id: i._id.toString() }
      }));
    });

    if (documents.length === 0) {
      documents.push(new Document({ pageContent: "The ERP system currently has no data.", metadata: {} }));
    }

    // 3. Generate mathematical embeddings for the documents using Google's embedding model
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "text-embedding-004", // Updated to the latest supported embedding model
    });

    console.log(`--> [RAG] Generating embeddings for ${documents.length} database records...`);
    
    // 4. Store them in the in-memory vector database
    vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    
    console.log("--> [RAG] Vector Database initialized successfully!");
    return vectorStore;
  } catch (error) {
    console.error("--> [RAG Error] Failed to initialize vector database:", error.message);
    throw error;
  }
};

// [A] & [G]: Augment and Generate based on user query
const processQuery = async (query) => {
  require('dotenv').config();

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing in environment variables. Please add it to .env to enable the Smart Assistant.");
  }

  try {
    console.log(`\n--> [RAG] Processing user query: "${query}"`);
    
    // 1. Ensure Vector DB is initialized
    const store = await initializeVectorDatabase();
    
    // 2. Perform Semantic Search (Retrieve top 5 most relevant documents)
    const retriever = store.asRetriever(5);
    const retrievedDocs = await retriever.invoke(query);
    
    // 3. Augment the prompt with retrieved context
    const contextText = retrievedDocs.map(doc => doc.pageContent).join("\n\n");
    console.log(`--> [RAG] Retrieved ${retrievedDocs.length} relevant documents from Vector DB.`);

    const model = new ChatGoogleGenerativeAI({
      temperature: 0,
      modelName: "gemini-pro", // Reliable standard model
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", `You are a Smart ERP Assistant. Answer the user's question based strictly on the following database records retrieved from the ERP system. 
      If the answer is not in the context, politely say that you don't have enough data to answer it. Do not invent information. Format nicely using bullet points if helpful.
      
      RETRIEVED DATABASE RECORDS:
      {context}`],
      ["human", "{question}"]
    ]);

    // 4. Generation pipeline
    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    console.log("--> [RAG] Sending Augmented Prompt to Google Gemini LLM...");
    
    // 5. Invoke with timeout protection
    const result = await Promise.race([
      chain.invoke({
        context: contextText,
        question: query
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("LLM Generation Timed Out (took more than 20 seconds).")), 20000))
    ]);

    console.log("--> [RAG] Answer generated successfully!");
    return result;

  } catch (error) {
    console.error("--> AI Service Error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  processQuery,
};
