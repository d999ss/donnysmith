export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body
  const userMessage = messages?.[messages.length - 1]?.content || 'hello'
  
  // Simple delay to show thinking
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const response = `$ echo "${userMessage}"
${userMessage}

$ whoami
Donny Smith - Executive Creative Director
Bored Optimism™ | Park City, UT
@donnysmith on X | Joined February 2008

$ cat ~/company.txt
@makebttr - A Brand & Digital Experience Company
Helping ambitious teams design a better future.
makebttr.com

$ cat ~/philosophy.txt
"An object in motion stays in motion."

$ ls -la services/
drwxr-xr-x  brand-strategy/
drwxr-xr-x  digital-experiences/  
drwxr-xr-x  creative-direction/
drwxr-xr-x  team-consulting/

What ambitious project can we help you build?`

  // Return as plain text stream
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'no-cache')
  res.status(200).send(response)
}