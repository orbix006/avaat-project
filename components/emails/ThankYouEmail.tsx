import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
  Link
} from '@react-email/components';
import * as React from 'react';

interface ThankYouEmailProps {
  name: string;
}

export const ThankYouEmail = ({ name }: ThankYouEmailProps) => {
  const firstName = name.split(' ')[0] || 'there';

  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting Avaat Design</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for reaching out!</Heading>
          
          <Text style={text}>
            Hi {firstName},
          </Text>
          
          <Text style={text}>
            We have successfully received your consultation request. Our team at Avaat Design will review your project details and get back to you shortly, typically within 24-48 business hours.
          </Text>

          <Text style={text}>
            In the meantime, you might want to explore some of our <Link href="https://avaat.design/portfolio" style={link}>recent projects</Link> or learn more about our <Link href="https://avaat.design/#process" style={link}>design process</Link>.
          </Text>
          
          <Text style={text}>
            We look forward to the possibility of working together to bring your vision to life.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Best regards,<br />
            <strong>The Avaat Design Team</strong><br />
            <Link href="https://avaat.design" style={footerLink}>avaat.design</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ThankYouEmail;

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

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const footer = {
  color: '#888',
  fontSize: '14px',
  lineHeight: '22px',
};

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
};

const footerLink = {
  color: '#888',
  textDecoration: 'none',
};
