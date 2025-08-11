"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { mockAuth, mockSignUp, User } from "../../lib/auth";
import { toast } from "react-toastify";

// Temporary Checkbox, Card placeholders (if not implemented)
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { className?: string };
const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <input
    type="checkbox"
    className={`h-4 w-4 text-orange-400 focus:ring-orange-400 border-gray-300 rounded ${className || ''}`}
    {...props}
  />
);

type CardProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };
const Card = ({ children, ...props }: CardProps) => <div {...props}>{children}</div>;

type CardContentProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };
const CardContent = ({ children, ...props }: CardContentProps) => <div {...props}>{children}</div>;

// Tabs implementation using React state
import { createContext, useContext, Dispatch, SetStateAction } from "react";

type TabsContextType = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

const TabsContext = createContext<TabsContextType | null>(null);

type TabsProps = {
  defaultValue: string;
  children: ReactNode;
  className?: string;
};
function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = {
  children: ReactNode;
  className?: string;
};
function TabsList({ children, className }: TabsListProps) {
  return <div className={className}>{children}</div>;
}

type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  children: ReactNode;
  className?: string;
};
function TabsTrigger({ value, children, className, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs");
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      className={
        `${className ?? ""} px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ` +
        (isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900")
      }
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = {
  value: string;
  children: ReactNode;
};
function TabsContent({ value, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within a Tabs");
  const { activeTab } = context;
  if (activeTab !== value) return null;
  return <div>{children}</div>;
}


export default function AccountPage() {
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    if (mockAuth(email, password)) {
      toast.success("Login successful!");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement)?.value;

    const newUser: User = {
      email,
      password,
      fullName,
      accountType,
    };

    if (mockSignUp(newUser)) {
      toast.success("Sign-up successful! You can now log in.");
    } else {
      toast.error("User already exists. Please log in.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login/Sign Up Card */}
        <Card className="border border-gray-200 shadow-xl rounded-2xl bg-white backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Handcraft Haven</h1>
              <p className="text-gray-600 text-sm">Join our community of artisans and craft lovers</p>
            </div>

            {/* Tabs for Login/Sign Up */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="login" className="transition-all">Login</TabsTrigger>
                <TabsTrigger value="signup" className="transition-all">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form className="space-y-6" onSubmit={handleLogin}>
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors" 
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors"
                      />
                      <FontAwesomeIcon 
                        icon={faEye} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="rounded border-gray-300 text-orange-400 focus:ring-orange-400" />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <Button variant="link" className="text-sm text-orange-400 p-0 hover:text-orange-500 hover:underline">
                      Forgot password?
                    </Button>
                  </div>

                  {/* Login Button */}
                  <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 rounded-lg shadow-sm transition-colors">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup">
                <form className="space-y-6" onSubmit={handleSignUp}>
                  {/* Account Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">I want to:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={accountType === 'buyer' ? 'filled' : 'outline'}
                        className={
                          accountType === 'buyer'
                            ? 'border border-orange-400 bg-orange-400 text-white font-medium px-4 rounded-lg transition-colors'
                            : 'border border-gray-300 bg-white text-gray-700 font-medium px-4 rounded-lg hover:bg-gray-50 transition-colors'
                        }
                        onClick={() => setAccountType('buyer')}
                      >
                        Buy Items
                      </Button>
                      <Button
                        type="button"
                        variant={accountType === 'seller' ? 'filled' : 'outline'}
                        className={
                          accountType === 'seller'
                            ? 'border border-orange-400 bg-orange-400 text-white font-medium py-2 px-4 rounded-lg transition-colors'
                            : 'border border-gray-300 bg-white text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors'
                        }
                        onClick={() => setAccountType('seller')}
                      >
                        Sell Items
                      </Button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input 
                      type="text" 
                      name="fullName"
                      placeholder="Enter your full name" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors" 
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors" 
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors"
                      />
                      <FontAwesomeIcon 
                        icon={faEye} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                  </div>

                  {/* Sign Up Button */}
                  <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 rounded-lg shadow-sm transition-colors">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </main>
  );
}
