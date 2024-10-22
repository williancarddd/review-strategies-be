export function studyReminderTemplate(variables: { discipline: string, hour: Date, studentName: string }) {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="pt-BR">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
    Olá ${variables.studentName}, aqui está um lembrete para o estudo da disciplina ${variables.discipline}.
  </div>

  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:20px 25px 48px;background-color:#f9f9f9;">
      <tbody>
        <tr style="width:100%">
          <td>
            <h1 style="font-size:28px;font-weight:bold;margin-top:48px">Lembrete de Estudo</h1>
            <p style="font-size:16px;line-height:26px;margin:16px 0">Olá, ${variables.studentName},</p>
            <p style="font-size:16px;line-height:26px;margin:16px 0">Este é um lembrete para você revisar a disciplina <strong>${variables.discipline}</strong> no dia <strong>${variables.hour.toLocaleDateString('pt-BR')}</strong> às <strong>${variables.hour.toLocaleTimeString('pt-BR')}</strong>.</p>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:24px 0">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:16px;line-height:26px;margin:16px 0">
                      <a href="https://www.reviewstrategies.com.br" style="color:#FF6363;text-decoration:none" target="_blank">👉 Clique aqui para acessar os materiais de estudo 👈</a>
                    </p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0">Mantenha-se focado e bons estudos!</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="font-size:16px;line-height:26px;margin:16px 0">Atenciosamente,<br />- Equipe Herman.ai</p>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dddddd;margin-top:48px" />
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
  `;
}
