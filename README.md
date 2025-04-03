# dietChartGenerator
Deep Learning Final Project

Doc Link: https://docs.google.com/document/d/1bN4nzD3LRyAuY305WRv_w-5LNVFiPYjsPIJqBMg8KsQ/edit?tab=t.0

DataBase Credentials:

Supabase: https://supabase.com/dashboard/project/abqyqefaacrthzeksogg

Tables: users

# 🥗 dietChartGenerator

This project is the final submission for the **Deep Learning course**. It is a complete pipeline for generating **personalized diet charts** using a fine-tuned DistilGPT model trained on a custom diet dataset. The application takes into account individual user profiles including health conditions, preferences, and goals to generate tailored diet recommendations.

---

## 🚀 Features

- 🧠 Fine-tuned **DistilGPT** model on a custom nutrition & diet dataset
- 📦 User authentication and data storage using **Supabase**
- 📝 Automatically generates personalized diet charts based on user input
- 🌐 Deployed with a simple and clean UI for interaction

---

## 🔧 Tech Stack

- **Model:** DistilGPT (fine-tuned using HuggingFace Transformers)
- **Dataset:** Custom compiled diet and nutrition dataset
- **Backend:** Python (FastAPI)
- **Frontend:** React / Next.js (optional)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Docker + DigitalOcean

---

## 🧪 Dataset

The custom dataset contains:
- Nutritional information
- User health profiles (e.g., diabetic, hypertensive)
- Sample diet recommendations
- Caloric and macronutrient breakdowns

The dataset was cleaned and tokenized for fine-tuning DistilGPT using HuggingFace `Trainer`.

---

## 🧠 Model Training

- **Base Model:** `distilgpt2` from HuggingFace
- **Fine-tuning:** Done on Google Colab with custom prompts + responses dataset
- **Tokenizer:** GPT2Tokenizer
- **Frameworks:** PyTorch + HuggingFace Transformers

Training Sample:
