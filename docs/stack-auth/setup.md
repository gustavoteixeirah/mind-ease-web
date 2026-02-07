# Setup
URL: /docs/getting-started/setup
Source: /vercel/path0/docs/content/docs/(guides)/getting-started/setup.mdx



***

## title: Setup

### Prerequisites

Before getting started, make sure you have a project set up for your chosen platform:

* **Next.js**: A [Next.js project](https://nextjs.org/docs/getting-started/installation) using the app router (Stack Auth does not support the pages router on Next.js)
* **React**: A [React project](https://react.dev/learn/creating-a-react-app) (we show examples with Vite)
* **JavaScript**: A Node.js project with Express
* **Python**: A Python environment with your chosen framework (Django, FastAPI, or Flask)

We recommend using our **setup wizard** for JavaScript frameworks for a seamless installation experience. For Python, we recommend using the REST API approach.

### Setup Wizard / Manual Installation

<Tabs defaultValue="wizard">
  <TabsList>
    <TabsTrigger value="wizard">Setup wizard (recommended for JS)</TabsTrigger>
    <TabsTrigger value="manual">Manual installation</TabsTrigger>
  </TabsList>

  <TabsContent value="wizard">
    <Steps>
      <Step>
        ### Run installation wizard
      </Step>

      <Info>
        The setup wizard is available for JavaScript/TypeScript frameworks. For Python projects, please use the manual installation method.
      </Info>

      Run Stack's installation wizard with the following command:

      ```sh title="Terminal"
      npx @stackframe/init-stack@latest
      ```

      <Step>
        ### Update API keys
      </Step>

      Create an account on [the Stack Auth dashboard](https://app.stack-auth.com/projects), create a new project with an API key, and copy its environment variables into the appropriate configuration file:

      **Next.js:**

      ```bash title=".env.local"
      NEXT_PUBLIC_STACK_PROJECT_ID=<your-project-id>
      NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
      STACK_SECRET_SERVER_KEY=<your-secret-server-key>
      ```

      **React:**

      ```typescript title="stack/client.ts"
      // Update the values in stack/client.ts created by the wizard
      export const stackClientApp = new StackClientApp({
        projectId: "your-project-id",
        publishableClientKey: "your-publishable-client-key",
        tokenStore: "cookie",
      });
      ```

      **Vanilla JavaScript:**

      ```bash title=".env"
      STACK_PROJECT_ID=<your-project-id>
      STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
      STACK_SECRET_SERVER_KEY=<your-secret-server-key>
      ```

      <Step>
        ### Done!
      </Step>

      That's it! The wizard should have created or updated the following files in your project:

      **For Next.js:**

      * `app/handler/[...stack]/page.tsx`: Default pages for sign-in, sign-out, account settings, and more
      * `app/layout.tsx`: Updated to wrap the entire body with `StackProvider` and `StackTheme`
      * `app/loading.tsx`: Suspense boundary for Stack's async hooks
      * `stack/server.ts`: Contains the `stackServerApp` for server-side usage
      * `stack/client.ts`: Contains the `stackClientApp` for client-side usage

      **For React:**

      * `stack/client.ts`: Contains the `stackClientApp` configuration
      * Your app should be wrapped with `StackProvider` and `StackTheme`

      **For Node.js/Express:**

      * `stack/server.ts`: Contains the `stackServerApp` configuration
    </Steps>
  </TabsContent>

  <TabsContent value="manual">
    <Info>
      Note: The setup wizard also supports existing, complicated projects. Cases where manual installation is necessary are rare for JavaScript frameworks.
    </Info>

    <Steps>
      <Step>
        ### Install package
      </Step>

      First, install the appropriate Stack package:

      **Next.js:**

      ```bash title="Terminal"
      npm install @stackframe/stack
      ```

      **React:**

      ```bash title="Terminal"
      npm install @stackframe/react
      ```

      **Express:**

      ```bash title="Terminal"
      npm install @stackframe/js
      ```

      **Node.js:**

      ```bash title="Terminal"
      npm install @stackframe/js
      ```

      **Django:**

      ```bash title="Terminal"
      pip install requests
      ```

      **FastAPI:**

      ```bash title="Terminal"
      pip install requests
      ```

      **Flask:**

      ```bash title="Terminal"
      pip install requests
      ```

      <Step>
        ### Create API keys
      </Step>

      [Register a new account on Stack](https://app.stack-auth.com/handler/sign-up), create a project in the dashboard, create a new API key from the left sidebar, and copy the project ID, publishable client key, and secret server key.

      <Step>
        ### Configure environment variables
      </Step>

      Set up your environment variables or configuration:

      **Next.js:**

      ```bash title=".env.local"
      NEXT_PUBLIC_STACK_PROJECT_ID=<your-project-id>
      NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
      STACK_SECRET_SERVER_KEY=<your-secret-server-key>
      ```

      **React:**

      ```bash title=".env"
      # Store these in environment variables or directly in the client file during development
      VITE_STACK_PROJECT_ID=<your-project-id>
      VITE_STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
      ```

      **Express:**

      ```bash title=".env"
      STACK_PROJECT_ID=<your-project-id>
      STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
      STACK_SECRET_SERVER_KEY=<your-secret-server-key>
      ```

      **Node.js:**

      ```bash title=".env"
      STACK_PROJECT_ID=<your-project-id>
      STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
      STACK_SECRET_SERVER_KEY=<your-secret-server-key>
      ```

      **Django:**

      ```python title="settings.py"
      import os

      stack_project_id = os.getenv("STACK_PROJECT_ID")
      stack_publishable_client_key = os.getenv("STACK_PUBLISHABLE_CLIENT_KEY")
      stack_secret_server_key = os.getenv("STACK_SECRET_SERVER_KEY")
      ```

      **FastAPI:**

      ```python title="main.py"
      import os

      stack_project_id = os.getenv("STACK_PROJECT_ID")
      stack_publishable_client_key = os.getenv("STACK_PUBLISHABLE_CLIENT_KEY")
      stack_secret_server_key = os.getenv("STACK_SECRET_SERVER_KEY")
      ```

      **Flask:**

      ```python title="app.py"
      import os

      stack_project_id = os.getenv("STACK_PROJECT_ID")
      stack_publishable_client_key = os.getenv("STACK_PUBLISHABLE_CLIENT_KEY")
      stack_secret_server_key = os.getenv("STACK_SECRET_SERVER_KEY")
      ```

      <Step>
        ### Create Stack configuration
      </Step>

      Create the Stack app configuration:

      **stack/server.ts:**

      ```typescript title="stack/server.ts"
      import "server-only";
      import { StackServerApp } from "@stackframe/stack";

      export const stackServerApp = new StackServerApp({
        tokenStore: "nextjs-cookie", // storing auth tokens in cookies
      });
      ```

      **stack/client.ts:**

      ```typescript title="stack/client.ts"
      import { StackClientApp } from "@stackframe/stack";

      export const stackClientApp = new StackClientApp({
        // Environment variables are automatically read
      });
      ```

      **stack/client.ts:**

      ```typescript title="stack/client.ts"
      import { StackClientApp } from "@stackframe/react";
      // If you use React Router, uncomment the next line and the redirectMethod below
      // import { useNavigate } from "react-router-dom";

      export const stackClientApp = new StackClientApp({
        projectId: process.env.VITE_STACK_PROJECT_ID || "your-project-id",
        publishableClientKey: process.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "your-publishable-client-key",
        tokenStore: "cookie",
        // redirectMethod: { useNavigate }, // Optional: only if using react-router-dom
      });
      ```

      **stack/server.ts:**

      ```typescript title="stack/server.ts"
      import { StackServerApp } from "@stackframe/js";

      export const stackServerApp = new StackServerApp({
        projectId: process.env.STACK_PROJECT_ID,
        publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
        secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
        tokenStore: "memory",
      });
      ```

      **stack/client.ts:**

      ```typescript title="stack/client.ts"
      import { StackClientApp } from "@stackframe/js";

      export const stackClientApp = new StackClientApp({
        projectId: process.env.STACK_PROJECT_ID,
        publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
        tokenStore: "cookie",
      });
      ```

      **stack/server.js:**

      ```javascript title="stack/server.js"
      import { StackServerApp } from "@stackframe/js";

      export const stackServerApp = new StackServerApp({
        projectId: process.env.STACK_PROJECT_ID,
        publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
        secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
        tokenStore: "memory",
      });
      ```

      **stack/client.js:**

      ```javascript title="stack/client.js"
      import { StackClientApp } from "@stackframe/js";

      export const stackClientApp = new StackClientApp({
        projectId: process.env.STACK_PROJECT_ID,
        publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
        tokenStore: "cookie",
      });
      ```

      **views.py:**

      ```python title="views.py"
      import requests

      def stack_auth_request(method, endpoint, **kwargs):
          res = requests.request(
              method,
              f'https://api.stack-auth.com/{endpoint}',
              headers={
                  'x-stack-access-type': 'server',  # or 'client' if you're only accessing the client API
                  'x-stack-project-id': stack_project_id,
                  'x-stack-publishable-client-key': stack_publishable_client_key,
                  'x-stack-secret-server-key': stack_secret_server_key,  # not necessary if access type is 'client'
                  **kwargs.pop('headers', {}),
              },
              **kwargs,
          )
          if res.status_code >= 400:
              raise Exception(f"Stack Auth API request failed with {res.status_code}: {res.text}")
          return res.json()
      ```

      **main.py:**

      ```python title="main.py"
      import requests

      def stack_auth_request(method, endpoint, **kwargs):
          res = requests.request(
              method,
              f'https://api.stack-auth.com/{endpoint}',
              headers={
                  'x-stack-access-type': 'server',  # or 'client' if you're only accessing the client API
                  'x-stack-project-id': stack_project_id,
                  'x-stack-publishable-client-key': stack_publishable_client_key,
                  'x-stack-secret-server-key': stack_secret_server_key,  # not necessary if access type is 'client'
                  **kwargs.pop('headers', {}),
              },
              **kwargs,
          )
          if res.status_code >= 400:
              raise Exception(f"Stack Auth API request failed with {res.status_code}: {res.text}")
          return res.json()
      ```

      **app.py:**

      ```python title="app.py"
      import requests

      def stack_auth_request(method, endpoint, **kwargs):
          res = requests.request(
              method,
              f'https://api.stack-auth.com/{endpoint}',
              headers={
                  'x-stack-access-type': 'server',  # or 'client' if you're only accessing the client API
                  'x-stack-project-id': stack_project_id,
                  'x-stack-publishable-client-key': stack_publishable_client_key,
                  'x-stack-secret-server-key': stack_secret_server_key,  # not necessary if access type is 'client'
                  **kwargs.pop('headers', {}),
              },
              **kwargs,
          )
          if res.status_code >= 400:
              raise Exception(f"Stack Auth API request failed with {res.status_code}: {res.text}")
          return res.json()
      ```

      <Step>
        ### Set up authentication handlers (Frontend frameworks only)
      </Step>

      For JavaScript frameworks, create the authentication handler:

      **Next.js:**

      ```typescript title="app/handler/[...stack]/page.tsx"
      import { StackHandler } from "@stackframe/stack";
      import { stackServerApp } from "@/stack/server";

      export default function Handler(props: unknown) {
        return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
      }
      ```

      **React:**

      ```typescript title="App.tsx"
      import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
      import { Suspense } from "react";
      import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
      import { stackClientApp } from "./stack/client";

      function HandlerRoutes() {
        const location = useLocation();
        return (
          <StackHandler app={stackClientApp} location={location.pathname} fullPage />
        );
      }

      export default function App() {
        return (
          <Suspense fallback={null}>
            <BrowserRouter>
              <StackProvider app={stackClientApp}>
                <StackTheme>
                  <Routes>
                    <Route path="/handler/*" element={<HandlerRoutes />} />
                    <Route path="/" element={<div>hello world</div>} />
                  </Routes>
                </StackTheme>
              </StackProvider>
            </BrowserRouter>
          </Suspense>
        );
      }
      ```

      **Express:**

      ```typescript title="Note"
      // Express doesn't use built-in handlers
      // Use the REST API or integrate with your frontend
      ```

      **Node.js:**

      ```javascript title="Note"
      // Node.js doesn't use built-in handlers
      // Use the REST API or integrate with your frontend
      ```

      <Step>
        ### Add providers (Next.js and React only)
      </Step>

      For Next.js and React, wrap your app with Stack providers:

      **Next.js:**

      ```typescript title="app/layout.tsx"
      import React from "react";
      import { StackProvider, StackTheme } from "@stackframe/stack";
      import { stackServerApp } from "@/stack/server";

      export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
          <html lang="en">
            <body>
              <StackProvider app={stackServerApp}>
                <StackTheme>
                  {children}
                </StackTheme>
              </StackProvider>
            </body>
          </html>
        );
      }
      ```

      **React:**

      ```typescript title="Note"
      // Already shown in the App.tsx example above
      // Make sure to wrap your app with StackProvider and StackTheme
      ```

      <Step>
        ### Add loading boundary (Next.js only)
      </Step>

      For Next.js, add a Suspense boundary:

      ```typescript title="app/loading.tsx"
      export default function Loading() {
      // You can use any loading indicator here
      return <>
      Loading...
      </>;
      }
      ```

      <Step>
        ### Add suspense boundary (React only)
      </Step>

      For React, add a suspense boundary:

      ```typescript title="App.tsx"
      import { Suspense } from "react";
      import { StackProvider } from "@stackframe/react";
      import { stackClientApp } from "./stack/client";

      export default function App() {
      return (
      // Wrap your StackProvider with Suspense for async hooks to work
      <Suspense fallback={<div>Loading...</div>}>
      <StackProvider app={stackClientApp}>
        {/* Your app content */}
      </StackProvider>
      </Suspense>
      );
      }
      ```

      <Step>
        ### Done!
      </Step>
    </Steps>
  </TabsContent>
</Tabs>

## Post-setup

That's it! Stack is now configured in your project.

### Testing your setup

**Next.js:**

```bash title="Terminal"
# Start your Next.js app
npm run dev

# Navigate to the sign-up page
# http://localhost:3000/handler/sign-up
```

**React:**

```bash title="Terminal"
# Start your React app
npm run dev

# Navigate to the sign-up page
# http://localhost:5173/handler/sign-up
```

**Express:**

```bash title="Terminal"
# Start your Express server
npm start

# Use the REST API or integrate with your frontend
# Check the REST API documentation for endpoints
```

**Node.js:**

```bash title="Terminal"
# Start your Node.js app
node index.js

# Use the REST API or integrate with your frontend
# Check the REST API documentation for endpoints
```

**Django:**

```python title="Terminal"
# Test the Stack Auth API connection
print(stack_auth_request('GET', '/api/v1/projects/current'))

# Start your Django server
python manage.py runserver
```

**FastAPI:**

```python title="Terminal"
# Test the Stack Auth API connection
print(stack_auth_request('GET', '/api/v1/projects/current'))

# Start your FastAPI server
uvicorn main:app --reload
```

**Flask:**

```python title="Terminal"
# Test the Stack Auth API connection
print(stack_auth_request('GET', '/api/v1/projects/current'))

# Start your Flask server
flask run
```

### What you'll see

For JavaScript frameworks with built-in UI components, you'll see the Stack Auth sign-up page:

<img src="/imgs/sign-in.png" alt="Stack sign-in page" width={350} height={350} className="mx-auto block rounded-lg" />

After signing up/in, you will be redirected back to the home page. You can also check out the account settings page.

<img src="/imgs/account-settings.png" alt="Stack account settings page" className="mx-auto block rounded-lg" />

For Python and backend-only JavaScript setups, you'll interact with Stack Auth through the REST API.

## Example usage

Here are some basic usage examples for each platform:

**Server Component:**

```typescript title="Server Component"
import { stackServerApp } from "@/stack/server";

// In a Server Component or API route
const user = await stackServerApp.getUser();
if (user) {
  console.log("User is signed in:", user.displayName);
} else {
  console.log("User is not signed in");
}
```

**Client Component:**

```typescript title="Client Component"
'use client';
import { useUser } from "@stackframe/stack";

export default function MyComponent() {
  const user = useUser();
  
  if (user) {
    return <div>Hello, {user.displayName}!</div>;
  } else {
    return <div>Please sign in</div>;
  }
}
```

**Component:**

```typescript title="Component"
import { useUser } from "@stackframe/react";

export default function MyComponent() {
  const user = useUser();
  
  if (user) {
    return <div>Hello, {user.displayName}!</div>;
  } else {
    return <div>Please sign in</div>;
  }
}
```

**server.ts:**

```typescript title="server.ts"
import { stackServerApp } from "./stack/server.js";

app.get('/profile', async (req, res) => {
  try {
    // Get access token from request headers
    const accessToken = req.headers['x-stack-access-token'];
    const user = await stackServerApp.getUser({ accessToken });
    
    if (user) {
      res.json({ message: `Hello, ${user.displayName}!` });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**index.js:**

```javascript title="index.js"
import { stackServerApp } from "./stack/server.js";

async function checkUser(accessToken) {
  try {
    const user = await stackServerApp.getUser({ accessToken });
    
    if (user) {
      console.log(`Hello, ${user.displayName}!`);
    } else {
      console.log('User not authenticated');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**views.py:**

```python title="views.py"
# In your views.py
def profile_view(request):
    # Get access token from request headers
    access_token = request.headers.get('X-Stack-Access-Token')
    
    try:
        user_data = stack_auth_request('GET', '/api/v1/users/me', headers={
            'x-stack-access-token': access_token,
        })
        return JsonResponse({'message': f"Hello, {user_data['displayName']}!"})
    except Exception as e:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
```

**main.py:**

```python title="main.py"
from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

@app.get("/profile")
async def get_profile(x_stack_access_token: str = Header(None)):
    if not x_stack_access_token:
        raise HTTPException(status_code=401, detail="Access token required")
    
    try:
        user_data = stack_auth_request('GET', '/api/v1/users/me', headers={
            'x-stack-access-token': x_stack_access_token,
        })
        return {"message": f"Hello, {user_data['displayName']}!"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Not authenticated")
```

**app.py:**

```python title="app.py"
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/profile')
def profile():
    access_token = request.headers.get('X-Stack-Access-Token')
    
    if not access_token:
        return jsonify({'error': 'Access token required'}), 401
    
    try:
        user_data = stack_auth_request('GET', '/api/v1/users/me', headers={
    'x-stack-access-token': access_token,
        })
        return jsonify({'message': f"Hello, {user_data['displayName']}!"})
    except Exception as e:
        return jsonify({'error': 'Not authenticated'}), 401
```

## Next steps

Next up, we will show you how to [retrieve and update user information](./users.mdx), and how to [protect a page](./users.mdx#protecting-a-page) from unauthorized access.

For Python developers, check out the [REST API documentation](../rest-api/overview.mdx) to learn more about the available endpoints and how to use them in your Python application.
