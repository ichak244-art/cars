const express = require("express");
const cors = require("cors");
const path = require("path");
const mollie = require("@mollie/api-client")({
  apiKey: "test_RAUVpGE4Jf6jEyq3SEPKdfDtPgEJAj",
}); // замени на свой live-ключ

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // отдаём index.html и остальные файлы

app.post("/api/pay", async (req, res) => {
  const { amount } = req.body;

  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: parseFloat(amount).toFixed(2), // пример: "10.00"
      },
      description: "Пожертвование",
      redirectUrl: "danke.html", // замени на свою страницу благодарности
    });

    res.json({ url: payment.getCheckoutUrl() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при создании платежа" });
  }
});

