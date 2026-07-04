import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary">CemGuard</h1>
          <p className="text-sm font-semibold text-muted-foreground mt-2">Industrial Reliability Decision Support Platform</p>
          <p className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-wider">Research & Demonstration Environment</p>
          <p className="text-xs text-muted-foreground/40 mt-1">Dangote Cement Plc Research Prototype</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-3 py-2 border border-border bg-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="admin@dangote.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 border border-border bg-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            formAction={login} 
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
