# XSWareWeb

**XSWareSite** is the official **company website of xsware solution**  
👉 https://xsware.pl

The application is built with **Angular** and serves as a public-facing corporate website,
providing information about the company, its services and products.  
It also includes a **login mechanism integrated with XSWareAPI**, allowing authenticated
access to selected features of the XSWare ecosystem.


## 🏗️ Architecture Overview

![apps_architecture](https://xsware.pl/assets/img/other/apps_architecture_2.png)


## ✨ Key Features

- Corporate website for **xsware solution**
- Built with **Angular** and **Server-Side Rendering (SSR)**
- Secure authentication using **XSWareAPI**
- Responsive design based on **Bootstrap**
- Modern UI components with **@ng-bootstrap**
- Cookie-based token handling
- User-friendly notifications and alerts
- SEO-friendly architecture thanks to SSR


## 🛠️ Technology Stack

### Core
- **Angular**
- **TypeScript**
- **HTML5 / CSS3**

### UI & Styling
- **Bootstrap** – Responsive layout and styling
- **@ng-bootstrap** – Angular-native Bootstrap components
- **Devicon** – Technology and brand icons

### Angular Modules & Libraries
- **@angular/forms** – Template-driven and reactive forms
- **@angular/ssr** – Server-Side Rendering for improved SEO and performance
- **ngx-cookie-service** – Cookie handling (authentication tokens)
- **ngx-toastr** – Toast notifications and alerts


## 🔐 Authentication

- Authentication is handled via **XSWareAPI**
- Token is stored securely using cookies
- Authenticated requests are sent to the API using HTTPS
- Access to restricted sections is guarded by Angular route guards

## ⚙️ Configuration

The application uses **environment configuration files**.

Example `environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.xsware.pl'
};


### 🚀 Running the Application

Install dependencies
```bash
npm install
```
or
```bash
yarn install
```

Run in development mode
```bash
npm start
```
or
```bash
yarn start
```

Build for production
```bash
npm run build
```
or
```bash
yarn build
```


### Project Structure (simplified)

```
src/
 ├── app
 │   ├── components
 │   ├── config
 │   ├── pages
 │   ├── services
 │   └── shared
 ├── assets
 └── environments
```

### 🔄 Data & Authentication Flow

- User visits XSWareSite
- Public content is rendered (SSR for SEO)
- User logs in via XSWareAPI
- Authenticated API requests are sent to XSWareAPI
- Protected content becomes accessible

### 🧪 Testing

Testing strategy depends on the selected setup (e.g. Jest / React Testing Library).

Example:
```bash
npm test
```

### 🔗 Related Projects

- **XSWareAPI** – Backend API (Spring Boot, Java)
- **XSWareDBService** – Database service (Kotlin, Spring Boot)
