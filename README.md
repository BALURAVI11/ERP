# Full-Stack MERN ERP with Smart AI Assistant

A comprehensive Enterprise Resource Planning (ERP) web application built using the MERN stack (MongoDB, Express, React, Node.js). This system is designed to streamline business operations by managing Products, Customers, Suppliers, and complex financial workflows (Sales Orders, Purchase Orders, Goods Receipt Notes, and Invoices).

The project also features a **Smart ERP Assistant**, an integrated AI chatbot powered by Google Gemini and a true LangChain RAG (Retrieval-Augmented Generation) pipeline that allows users to query live database records using natural language.

## 🚀 Features

*   **Inventory & CRM Management:** Full CRUD capabilities for Products, Customers, and Suppliers.
*   **Order Workflows:** Create and manage Sales Orders and Purchase Orders with dynamic product selection and automated total calculations.
*   **Inventory Syncing (GRN):** Create Goods Receipt Notes (GRN) to track received shipments, which automatically syncs and updates global product stock.
*   **Invoicing System:** Generate dynamic financial invoices linked directly to completed Sales Orders.
*   **Smart AI Assistant (RAG Pipeline):** An embedded AI chat widget that converts database records into mathematical vectors (Google Embeddings), stores them in an in-memory Vector DB, and uses Semantic Search to answer user questions about their business data in real-time.
*   **Role-Based Security:** Secure JWT authentication and protected frontend routes.

## 💻 Tech Stack

**Frontend:**
*   React.js (Vite)
*   Redux Toolkit (State Management)
*   React Router v6
*   Material-UI (MUI)
*   Formik & Yup (Form Validation)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose
*   JSON Web Tokens (JWT) & bcryptjs

**AI Integration:**
*   LangChain (VectorStores, Retrievers, Output Parsers)
*   Google Generative AI (`gemini-pro`)
*   Google Embeddings (`text-embedding-004`)

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_google_gemini_api_key
```

### Running the Application

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be running at `http://localhost:5173`.
