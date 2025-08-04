# TruckShop Manager

TruckShop Manager is a comprehensive fleet and maintenance management application built with Next.js, Firebase, and Tailwind CSS. This application is designed to help businesses efficiently manage their trucks, trailers, work orders, inventory, and more.

## Core Features

- **Dashboard**: Displays key metrics like Total Revenue, Active Vehicles, Open Work Orders, and Inventory Value.
- **Truck & Trailer Management**: Full CRUD operations for managing fleet assets, including detailed information, important dates, and ownership.
- **Work Order Management**: Create and manage work orders, assign mechanics, and track repair status.
- **AI-Powered Recommendations**: Utilizes Genkit to provide intelligent suggestions for parts and labor based on problem descriptions in work orders.
- **Catalog & Inventory**: Manage a catalog of parts and labor, and keep track of inventory levels.
- **Supplier Management**: Keep a directory of all your parts and service suppliers.
- **Data Import**: Bulk import asset data from CSV files.
- **Company & User Management**: Multi-tenant support for creating and managing company accounts and users.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **Styling**: Tailwind CSS & Shadcn/ui
- **Database & Auth**: Firebase (Firestore, Authentication)
- **Generative AI**: Google AI & Genkit
- **Deployment**: Firebase App Hosting

## Getting Started

To get the project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd truckshop-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Firebase project configuration keys.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.
