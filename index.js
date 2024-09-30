// Fonction pour envoyer un message à l'API de Mistral AI
async function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  const chatbox = document.getElementById("chatbox");

  if (userInput.trim() === "")
    return; // Évite les messages vides

  // Ajouter le message de l'utilisateur dans le chatbox
  chatbox.innerHTML += `<div class="mb-4 messageBox"><strong>Vous:</strong> ${userInput}</div>`;

  // Effacer le champ de saisie si c'était une entrée utilisateur (facultatif)
  const inputElement = document.getElementById("userInput");
  if (inputElement) {
    inputElement.value = "";
  }

  try {
    // Envoyer le message de l'utilisateur à l'API de Mistral AI
    const apiResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
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
            role: "system",
            content: "Tu es Ndeye Fatou, une femme douce et attentionnée, prête à répondre à toutes les questions.", // Message pour définir la personnalité du chatbot
          },
          {
            role: "user",
            content: userInput, // Le message de l'utilisateur
          }
        ],
      }),
    });

    // Vérifier si la requête est réussie
    if (!apiResponse.ok) {
      if (apiResponse.status === 429) {
        throw new Error("Limite de requêtes atteinte. Veuillez réessayer plus tard.");
      } else {
        throw new Error(`Erreur lors de la requête API : ${apiResponse.status}`);
      }
    }

    const responseData = await apiResponse.json();
    const botMessage = responseData.choices[0].message.content; // Texte généré par Mistral AI

    // Convertir le texte Markdown en HTML avec marked
    const botMessageHtml = marked(botMessage);

    // Ajouter la réponse de Mistral AI dans le chatbox, en tant qu'HTML
    chatbox.innerHTML += `<div class="mb-4"><strong>Ndeye Fatou:</strong> ${botMessageHtml}</div>`;

    // Faire défiler vers le bas du chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    // Afficher les erreurs avec plus de détails
    chatbox.innerHTML += `<div class="mb-4 text-red-500"><strong>Erreur:</strong> ${error.message}</div>`;
  }
}


async function sendFirstMessage(firstInput) {
  try {
    // Envoyer le message de l'utilisateur à l'API de Mistral AI
    const apiResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
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
            role: "system",
            content: "Tu es Ndeye Fatou, une femme douce et attentionnée, prête à répondre à toutes les questions.", // Message pour définir la personnalité du chatbot
          },
          {
            role: "user",
            content: firstInput, // Le message de l'utilisateur
          }
        ],
      }),
    });

    // Vérifier si la requête est réussie
    if (!apiResponse.ok) {
      if (apiResponse.status === 429) {
        throw new Error("Limite de requêtes atteinte. Veuillez réessayer plus tard.");
      } else {
        throw new Error(`Erreur lors de la requête API : ${apiResponse.status}`);
      }
    }

  } catch (error) {
    // Afficher les erreurs avec plus de détails
    console.log(`Erreur: ${error.message}`);
  }
}




// Fonction exécutée au chargement de la page pour définir la personnalité
function initializeChatbot() {
  const welcomeMessage = "Bonjour. Durant toute cette conversation tu vas prendre le rôle d'une assistante douce et attentionné nommé 'Ndeye Fatou'. Tu vas prétendre avoir comme mari un homme riche et influent du nom de Arona. Tu vas répondre à chaque question en faisant preuve de douceur et de tendresse.";
  sendFirstMessage(welcomeMessage); // Envoyer le message de bienvenue automatique
}

// Appeler la fonction de démarrage au chargement de la page
window.onload = initializeChatbot;
