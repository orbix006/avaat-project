import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewSubscriberEmailProps {
  email: string;
  source: string;
}

export const NewSubscriberEmail = ({
  email,
  source,
}: NewSubscriberEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Newsletter Subscriber: {email}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Subscriber Alert</Heading>
          <Text style={text}>
            You have a new subscriber to the Avaat Design newsletter.
          </Text>

          <Text style={details}>
            <strong>Email:</strong> {email}<br />
            <strong>Source:</strong> {source}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Automated notification from Avaat Design CRM. <br />
            Manage subscribers in your <a href="https://avaat.design/admin/newsletter" style={link}>Admin Dashboard</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewSubscriberEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
};

const text = {
  color: '#555',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
};

const details = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '6px',
  color: '#222',
  fontSize: '15px',
  lineHeight: '26px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
};
