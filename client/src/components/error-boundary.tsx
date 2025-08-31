import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Home, Bug, Zap } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    if (typeof window !== "undefined") {
      console.group("🚨 React Error Boundary");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50" />

            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                {i % 3 === 0 ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : i % 3 === 1 ? (
                  <Bug className="w-3 h-3 text-orange-400" />
                ) : (
                  <Zap className="w-3 h-3 text-yellow-400" />
                )}
              </div>
            ))}
          </div>

          <Card className="glass-card max-w-2xl w-full relative z-10 border-2 border-red-200/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-[20px] p-[2px]">
              <div className="w-full h-full bg-white/95 rounded-[18px]" />
            </div>

            <div className="relative z-10">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
                    </div>

                    <div className="absolute inset-0 animate-ping">
                      <div className="w-20 h-20 border-4 border-red-400 rounded-full opacity-75" />
                    </div>
                    <div
                      className="absolute inset-0 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <div className="w-20 h-20 border-2 border-orange-400 rounded-full opacity-50" />
                    </div>
                  </div>
                </div>

                <CardTitle className="text-3xl font-black text-gray-800 mb-2">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Oops! Something Went Wrong
                  </span>
                </CardTitle>

                <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                  Don't worry, it's not your fault! Our Pokemon got a bit too
                  excited and caused a glitch.
                </p>

                {this.state.errorId && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-600">
                    <Bug className="w-3 h-3" />
                    Error ID: {this.state.errorId}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                      <Bug className="w-4 h-4" />
                      Development Error Details:
                    </h3>
                    <p className="text-sm text-red-700 font-mono bg-red-100 p-3 rounded-lg break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Fixes to Try:
                  </h3>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Refresh the page to reload your Pokemon collection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Check your internet connection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Try going back to the home page
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Clear your browser cache if the problem persists
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={this.handleReset}
                    className="button-hover-effect flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="button-hover-effect flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </Button>

                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    className="button-hover-effect bg-orange-50 hover:bg-orange-100 border-2 border-orange-300 hover:border-orange-400 text-orange-700 hover:text-orange-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Reload Page
                  </Button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    If this problem keeps happening, our Pokemon trainers are
                    working hard to fix it!
                    <br />
                    <span className="font-medium">
                      Thank you for your patience! 🧡
                    </span>
                  </p>
                </div>

                {process.env.NODE_ENV === "development" &&
                  this.state.errorInfo && (
                    <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <summary className="cursor-pointer font-semibold text-gray-700 mb-3 flex items-center gap-2 hover:text-gray-900 transition-colors">
                        <Bug className="w-4 h-4" />
                        Advanced Debug Info (Click to expand)
                      </summary>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Stack Trace:
                          </h4>
                          <pre className="text-xs font-mono text-gray-600 bg-gray-100 p-3 rounded-lg overflow-auto max-h-40 scrollbar-thin">
                            {this.state.error?.stack}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Component Stack:
                          </h4>
                          <pre className="text-xs font-mono text-gray-600 bg-gray-100 p-3 rounded-lg overflow-auto max-h-40 scrollbar-thin">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      </div>
                    </details>
                  )}
              </CardContent>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export const ErrorFallback: React.FC<{
  error?: Error;
  onReset?: () => void;
  title?: string;
  message?: string;
}> = ({
  error,
  onReset,
  title = "Something went wrong",
  message = "An unexpected error occurred",
}) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-8 space-y-4">
    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
      <AlertTriangle className="w-8 h-8 text-white" />
    </div>

    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 max-w-md">{error?.message || message}</p>
    </div>

    {onReset && (
      <Button
        onClick={onReset}
        variant="outline"
        className="button-hover-effect bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
);
