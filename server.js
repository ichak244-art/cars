const express = require("express");
const cors = require("cors");
const path = require("path");
const { createMollieClient } = require("@mollie/api-client");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Обработка платежей
app.post("/api/pay", async (req, res) => {
  try {
    const mollieClient = createMollieClient({
      apiKey: "test_RAUVpGE4Jf6jEyq3SEPKdfDtPgEJAj",
    });

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: req.body.amount,
      },
      description: `Spende an Hilfehub (${req.body.frequency})`,
      redirectUrl: "https://yourdomain.com/danke.html", // ЗАМЕНИТЕ НА ВАШ ДОМЕН
      webhookUrl: "https://yourdomain.com/webhook", // ДЛЯ ОБРАБОТКИ УВЕДОМЛЕНИЙ
      method: ["creditcard", "sepa", "klarnapaylater", "googlepay"],
    });

    res.json({ paymentUrl: payment.getCheckoutUrl() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen der Zahlung" });
  }
});

app.get("/", (req, res) => {
  res.send("Сервер работает");
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
