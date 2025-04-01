# Crypto

Crypto is a web application that uses React for the frontend and PHP with MySQL for the backend. This application allows users to manage and track their cryptocurrency investments.

## Features

- User authentication and authorization
- Real-time cryptocurrency price tracking
- Portfolio management
- Crypto transaction
- Transaction history

## Technologies Used

### Frontend

- React
- JavaScript
- HTML
- CSS

### Backend

- PHP
- MySQL

## Installation

### Prerequisites

- Node.js
- npm
- XAMPP or any other PHP and MySQL server

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/sooryanathg/Crypto.git
    ```

2. Navigate to the project directory:
    ```bash
    cd Crypto
    ```

3. Install frontend dependencies:
    ```bash
    cd crypto-frontend
    npm install
    ```

4. Set up the backend:
    - Start XAMPP and ensure Apache and MySQL are running.
    - Import the `crypto_system.sql` file into your MySQL database.
    - Configure the database connection in `db.php`.

5. Start the frontend development server:
    ```bash
    npm start
    ```

6. Access the application in your browser at `http://localhost:3000`.

## Usage

1. Register a new account or log in with existing credentials.
2. Create multiple wallets
3. Add your cryptocurrency investments to your portfolio.
4. You can transfer between wallets
5. Track the real-time prices and manage your transactions.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please contact [sooryanathgopi@gmail.com](mailto:sooryanathgopi@gmail.com).
