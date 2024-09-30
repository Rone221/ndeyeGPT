async function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  const chatbox = document.getElementById("chatbox");

  if (userInput.trim() === "") return; // Évite les messages vides

  // Ajouter le message de l'utilisateur dans le chatbox
  chatbox.innerHTML += `<div class="mb-4"><strong>Vous:</strong> ${userInput}</div>`;

  // Effacer le champ de saisie
  document.getElementById("userInput").value = "";

  try {
    // Envoyer le message de l'utilisateur à l'API de Mistral AI
    const apiResponse = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + api_key, // Remplacez par votre clé API Mistral
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            {
              role: "user",
              content: userInput, // Le message de l'utilisateur
            },
          ],
        }),
      }
    );

    // Vérifier si la requête est réussie
    if (!apiResponse.ok) {
      if (apiResponse.status === 429) {
        throw new Error(
          "Limite de requêtes atteinte. Veuillez réessayer plus tard."
        );
      } else {
        throw new Error(
          `Erreur lors de la requête API : ${apiResponse.status}`
        );
      }
    }

    const responseData = await apiResponse.json();
    const botMessage = responseData.choices[0].message.content; // Texte généré par Mistral AI

    // Convertir le texte Markdown en HTML
    const botMessageHtml = marked(botMessage); // Convertir le Markdown en HTML avec "marked"
    console.log(botMessageHtml);

    // Ajouter la réponse de Mistral AI dans le chatbox, en tant qu'HTML
    chatbox.innerHTML += `<div class="mb-4"><strong>Mbaye Ndiaye:</strong> ${botMessageHtml}</div>`;

    // Faire défiler vers le bas du chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    // Afficher les erreurs avec plus de détails
    chatbox.innerHTML += `<div class="mb-4 text-red-500"><strong>Erreur:</strong> ${error.message}</div>`;
  }
}
