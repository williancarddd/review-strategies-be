export function recoveryPasswordTemplate(variables: { name: string, token: string }) {
    return `
    <h1>Recovery Password</h1>
    <p>Olá ${variables.name},</p>
    <p>${variables.token} duração | time -> 30 minutos (minutes) </p>
    `;
}
