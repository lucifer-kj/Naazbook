"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export function SessionStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <Clock className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking session...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Signed in as {session.user?.name || 'User'}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-red-600">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">Not signed in</span>
    </div>
  );
} 