# 🔐 Fernet Vault

A beautifully designed, full-stack web application for securely generating, encoding, and decoding [Fernet](https://github.com/fernet/spec/blob/master/Spec.md) tokens. 

This project was built from the ground up prioritizing **Clean Architecture**, **SOLID principles**, and **Modern UI best practices**.

---

## ✨ Features

- **Generate Secret Keys**: Easily generate secure 32-byte base64-encoded URL-safe secret keys.
- **Create Encoded Tokens**: Encrypt sensitive string messages into secure tokens using your secret key.
- **Decode Tokens**: Decrypt and read the contents of generated fernet tokens safely.
- **Modern UI**: An aesthetically stunning front-end featuring frosted glass elements (Glassmorphism), sleek dark mode styling, and an intuitive tabbed interface.

## 🛠️ Tech Stack

This project follows a strict decoupled architecture:

### Frontend (Client)
- **Framework**: React.js with Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Glassmorphism, Micro-animations)
  
### Backend (Server)
- **Framework**: Node.js with Express.js
- **Language**: TypeScript (`ts-node`)
- **Core Library**: `fernet` (for cryptographic operations)

---

## 🏗️ Architecture Design (Clean Architecture)

The backend exposes a highly abstracted RESTful API emphasizing Separation of Concerns:

```
fernet-vault/
├── server/                       # Backend source code
│   ├── core/
│   │   ├── services/
│   │   │   └── fernetService.ts  # Domain Logic (Encryption, Token Management)
│   ├── api/
│   │   └── routes.ts             # Presentation/Routes (Express API Handlers)
│   ├── server.ts                 # Infrastructure (Express Server Configuration)
│   └── types/                    # Domain Entity Declarations (Custom Types)
│
├── client/                       # Frontend source code (Vite + React)
│   └── src/
│       ├── App.tsx               # UI View / React Hooks & API Logic Implementation
│       └── index.css             # Vanilla CSS Token System & Glassmorphism UI
│
├── package.json                  # Root configurations and concurrent run scripts
└── tsconfig.json                 # TypeScript ruleset targeting strict types
```

---

## 🚀 Getting Started

To run this application locally, you will need Node.js and `yarn` installed on your machine.

### 1. Install Dependencies
This repo uses **Yarn workspaces** (a monorepo). Install everything once from the root:
```bash
yarn install
```

### 2. Run the Application
You don't need to start the client and server separately. We use `concurrently` to boot up both the frontend and backend with a single command!

From the root directory:
```bash
yarn dev
```

This will start:
- **Express Backend**: Running on `http://localhost:8102`
- **Vite Frontend UI**: Running on `http://localhost:8103` (or whatever secondary port Vite chooses automatically)

Simply open up the generated frontend URL in your web browser to use the application!

---

## 🎨 UI & Design Decisions

The application completely avoids bulky CSS frameworks (like Tailwind or Bootstrap) in favor of high-performance custom CSS variables.
- Utilizing `-webkit-backdrop-filter` for deep blur properties to simulate physical glass panes.
- High-contrast deep purple (#8b5cf6 -> #a78bfa) gradients, meeting WCAG standard visual design parameters.
- Built-in transitions across all interactable elements for a responsive "alive" user feel. 

## ⚖️ SOLID Principles Applied
- **Single Responsibility Principle (SRP)**: The Express Server configuration (`server.ts`) is completely decoupled from API Routes (`routes.ts`), which is in turn abstracted from the Domain Crypto Logic (`fernetService.ts`).
- **Dependency Inversion Principle (DIP)**: Top-level API Routes inject and rely on `FernetService` logic interfaces rather than raw fernet/crypto packages.

---

## Support & Recognition

If you find this project helpful and want to support its continued development, the best way is through **recognition**:

1. **Attribution:** Please keep the original copyright notices intact in the code. If you use this tool or its code in a public project, a shoutout or a link back to this repository is highly appreciated!
2. **Contribute Code:** We welcome pull requests! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to help build this tool.
3. **Star the Repo:** Giving the project a ⭐️ on GitHub helps others find it and gives the author recognition.

## License

This project is licensed under the [MIT License](LICENSE). 

Under the MIT License, anyone who uses, copies, or modifies this code must include your original copyright notice, ensuring you always receive credit for your work.

---

_For professional inquiries, connect on [LinkedIn](https://www.linkedin.com/in/gairik-singha/)._
