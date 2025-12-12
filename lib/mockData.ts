export type DocumentType = 'GST' | 'PAN' | 'Aadhaar' | 'Bank Statement' | 'Legal Notice' | 'Invoice' | 'Contract';

export interface Document {
  title: string;
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  size: string;
  status: 'processed' | 'processing' | 'pending';
  extractedFields?: Record<string, string>;
  entityId?: string;
  url?: string;
}

export interface Entity {
  id: string;
  name: string;
  type: 'person' | 'business';
  email?: string;
  phone?: string;
  pan?: string;
  gst?: string;
  documents: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  documentId?: string;
  entityId?: string;
  status: 'pending' | 'completed';
}

export interface Notification {
  id: string;
  type: 'deadline' | 'compliance' | 'system' | 'document';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'compliance' | 'deadline';
  actionLabel: string;
  actionUrl: string;
}

export const mockDocuments: Document[] = [
  {
  id: '1',
  name: 'GST Return Q4 2024.pdf',
  type: 'GST',
  uploadDate: '2024-01-15',
  size: '2.4 MB',
  status: 'processed',
  extractedFields: {
    'GSTIN': '29ABCDE1234F1Z5',
    'Period': 'Q4 2024',
    'Total Tax': '₹1,24,500'
  },
  entityId: '1',
  title: 'GST Return Q4 2024' // Add the title property here
  },
  {
    id: '2',
    name: 'PAN Card - Rajesh Kumar.pdf',
    type: 'PAN',
    uploadDate: '2024-01-14',
    size: '156 KB',
    status: 'processed',
    extractedFields: {
      'PAN': 'ABCDE1234F',
      'Name': 'Rajesh Kumar',
      'DOB': '15/06/1985'
    },
    entityId: '2',
    title: "PAN CARD"
  },
  {
    id: '3',
    name: 'Bank Statement Dec 2024.pdf',
    type: 'Bank Statement',
    uploadDate: '2024-01-13',
    size: '3.8 MB',
    status: 'processed',
    extractedFields: {
      'Account Number': 'XXXX5678',
      'Period': 'December 2024',
      'Closing Balance': '₹5,67,890'
    },
    title: "BANK STATEMENT"
  },
  {
    id: '4',
    name: 'Legal Notice - Property Dispute.pdf',
    type: 'Legal Notice',
    uploadDate: '2024-01-12',
    size: '890 KB',
    status: 'processed',
    extractedFields: {
      'Case Number': 'CN/2024/1234',
      'Issue Date': '10/01/2024',
      'Response Due': '25/01/2024'
    },
    title: "LEGAL NOTICE"
  },
  {
    id: '5',
    name: 'Invoice #INV-2024-001.pdf',
    type: 'Invoice',
    uploadDate: '2024-01-11',
    size: '245 KB',
    status: 'processing',
    title: "INVOICE"
  },
  {
    id: '6',
    name: 'Service Agreement.pdf',
    type: 'Contract',
    uploadDate: '2024-01-10',
    size: '1.2 MB',
    status: 'processed',
    extractedFields: {
      'Contract Date': '05/01/2024',
      'Validity': '1 Year',
      'Value': '₹10,00,000'
    },
    title: "SERVICE AGREEMENT"
  }
];

export const mockEntities: Entity[] = [
  {
    id: '1',
    name: 'Tech Solutions Pvt Ltd',
    type: 'business',
    email: 'contact@techsolutions.com',
    phone: '+91 98765 43210',
    gst: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    documents: ['1', '6'],
    riskLevel: 'low'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    type: 'person',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 12345',
    pan: 'ABCDE1234F',
    documents: ['2', '3'],
    riskLevel: 'low'
  },
  {
    id: '3',
    name: 'Global Imports Ltd',
    type: 'business',
    email: 'info@globalimports.com',
    phone: '+91 98765 67890',
    gst: '27FGHIJ5678K2L9',
    documents: ['4'],
    riskLevel: 'high'
  }
];

export const mockDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'GST Return Filing',
    description: 'File GST return for Q4 2024',
    dueDate: '2024-01-20',
    priority: 'high',
    documentId: '1',
    entityId: '1',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Legal Notice Response',
    description: 'Submit response to property dispute notice',
    dueDate: '2024-01-25',
    priority: 'high',
    documentId: '4',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Contract Renewal',
    description: 'Review and renew service agreement',
    dueDate: '2024-02-05',
    priority: 'medium',
    documentId: '6',
    entityId: '1',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Tax Payment',
    description: 'Pay advance tax for Q4',
    dueDate: '2024-01-31',
    priority: 'high',
    status: 'pending'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'GST Return Due Soon',
    message: 'GST return filing deadline is in 5 days',
    timestamp: '2024-01-15T10:30:00',
    read: false,
    priority: 'high',
    actionUrl: '/deadlines/1'
  },
  {
    id: '2',
    type: 'compliance',
    title: 'High Risk Entity Alert',
    message: 'Global Imports Ltd marked as high risk',
    timestamp: '2024-01-15T09:15:00',
    read: false,
    priority: 'high',
    actionUrl: '/entities/3'
  },
  {
    id: '3',
    type: 'document',
    title: 'Document Processed',
    message: 'Invoice #INV-2024-001.pdf has been processed',
    timestamp: '2024-01-15T08:45:00',
    read: true,
    priority: 'low',
    actionUrl: '/documents/5'
  },
  {
    id: '4',
    type: 'system',
    title: 'AI Model Updated',
    message: 'Document extraction accuracy improved by 15%',
    timestamp: '2024-01-14T16:20:00',
    read: true,
    priority: 'low'
  }
];

export const mockAISuggestions: AISuggestion[] = [
  {
    id: '1',
    title: 'Missing PAN Card',
    description: 'Tech Solutions Pvt Ltd is missing PAN card verification',
    type: 'compliance',
    actionLabel: 'Upload Document',
    actionUrl: '/upload'
  },
  {
    id: '2',
    title: 'Upcoming Deadline',
    description: '3 deadlines approaching in the next 7 days',
    type: 'deadline',
    actionLabel: 'View Deadlines',
    actionUrl: '/deadlines'
  },
  {
    id: '3',
    title: 'Document Categorization',
    description: '2 documents need manual review and categorization',
    type: 'document',
    actionLabel: 'Review Documents',
    actionUrl: '/library'
  }
];
