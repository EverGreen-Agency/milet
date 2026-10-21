// Em produção, o endpoint é a Vercel Function do mesmo domínio. Em desenvolvimento,
// mantenha a API Nest local como opção explícita para quem executar o monorepo.
window.MILET_V2_API_BASE_URL = ["127.0.0.1", "localhost"].includes(window.location.hostname)
  ? "http://127.0.0.1:4310"
  : "";
