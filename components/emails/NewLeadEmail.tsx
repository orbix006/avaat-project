import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column
} from '@react-email/components';
import * as React from 'react';

interface NewLeadEmailProps {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
}

export const NewLeadEmail = ({
  name,
  email,
  phone,
  projectType,
  budget,
  message,
}: NewLeadEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Lead: {name} ({projectType})</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Consultation Request</Heading>
          <Text style={text}>
            A new prospect has submitted a consultation request via the Avaat Design website.
          </Text>

          <Section style={detailsContainer}>
            <Row style={row}>
              <Column style={labelColumn}><Text style={label}>Name:</Text></Column>
              <Column><Text style={value}>{name}</Text></Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}><Text style={label}>Email:</Text></Column>
              <Column><Text style={value}>{email}</Text></Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}><Text style={label}>Phone:</Text></Column>
              <Column><Text style={value}>{phone}</Text></Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}><Text style={label}>Project:</Text></Column>
              <Column><Text style={value}>{projectType.replace(/_/g, ' ')}</Text></Column>
            </Row>
            <Row style={row}>
              <Column style={labelColumn}><Text style={label}>Budget:</Text></Column>
              <Column><Text style={value}>{budget.replace(/_/g, ' ')}</Text></Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Heading as="h3" style={h3}>Message Details</Heading>
          <Text style={messageText}>
            {message || "No message provided."}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Automated notification from Avaat Design CRM. <br />
            View this lead in your <a href="https://avaat.design/admin/leads" style={link}>Admin Dashboard</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewLeadEmail;

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
  padding: '0',
  margin: '0 0 20px 0',
};

const h3 = {
  color: '#444',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const text = {
  color: '#555',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px 0',
};

const detailsContainer = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '6px',
  marginBottom: '20px',
};

const row = {
  marginBottom: '10px',
};

const labelColumn = {
  width: '100px',
};

const label = {
  color: '#888',
  fontSize: '14px',
  margin: '0',
  fontWeight: 'bold' as const,
};

const value = {
  color: '#222',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500' as const,
};

const messageText = {
  color: '#444',
  fontSize: '15px',
  lineHeight: '24px',
  backgroundColor: '#f1f1f1',
  padding: '16px',
  borderRadius: '4px',
  fontStyle: 'italic',
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
