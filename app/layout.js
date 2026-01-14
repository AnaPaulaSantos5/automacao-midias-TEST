export const metadata = {
  title: "Projeto Flyer AI",
  description: "Agente inteligente de criação de flyers"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}