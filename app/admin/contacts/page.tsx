'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(data.contacts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Form Submissions</h1>
      <div className="grid gap-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="border p-4 rounded-lg">
            <h2 className="font-bold">{contact.name}</h2>
            <p className="text-sm text-gray-600">{contact.email}</p>
            <p className="text-sm text-gray-600">{contact.phone}</p>
            <p className="mt-2">{contact.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Service: {contact.service}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Submitted: {new Date(contact.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 