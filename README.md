# Hash Checker 🔐 / Hash Checker

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/dependencies-0-success" alt="Zero deps">
  <img src="https://img.shields.io/badge/port-3464-informational" alt="Port 3464">
</p>

---

## 🇬🇧 English

Web tool for computing file hashes (MD5, SHA-1, SHA-256, SHA-512). Drag-and-drop interface, instant computation, hash verification.

### Features

- 🔐 Drag-and-drop file upload
- 📊 Computes MD5, SHA-1, SHA-256, SHA-512 simultaneously
- ✅ Hash verification — paste expected value
- 🌓 Dark/light theme
- 📋 One-click copy

### Quick Start

```bash
git clone https://github.com/olegmrponsao34-boop/hash-checker
cd hash-checker
node server.js
```

Then open `http://localhost:3464` in your browser.

### API

```
POST /api - main endpoint (see source for details)
```

---

## 🇷🇺 Русский

Веб-инструмент для вычисления хешей файлов (MD5, SHA-1, SHA-256, SHA-512).
## Возможности
- Перетаскивание файлов или выбор через диалог
- Вычисление всех четырёх хешей одновременно
- Отображение имени и размера файла
- Проверка хеша — вставьте ожидаемое значение и увидите совпадение
- Тёмная и светлая темы (автоматически подстраивается под систему)
- Копирование хеша кликом
## Установка и запуск
```bash
npm install
npm start
```
Сервер запустится на http://localhost:3464
## API
### `POST /api/hash`
Принимает JSON:
```json
{
  "fileName": "example.txt",
  "fileData": "<base64 содержимое файла>"
}
```
Возвращает:
```json
{
  "md5": "d41d8cd98f00b204e9800998ecf8427e",
  "sha1": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "sha512": "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
  "fileName": "example.txt",
  "fileSize": 0
}
```
## Лицензия
MIT
## 💛 Support
If you find this project useful, consider supporting:
```
USDT TRC-20: TYVN7HLcb5nrLVee9k8DBMZofxJur7ZgLB
USDT TON:    UQD4mGTxZsIWXx1bNXJ1fsyN0XKvogr34TGSxB7D4nPzOozF
USDT ERC-20: 0xa79f0713ab132eae54002c9c34fbb837272590c0
```
---

