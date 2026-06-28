---
title: "Cybersecurity basics: Preparing for ENSICAEN"
description: "An overview of fundamental cybersecurity and e-payment concepts before taking the plunge."
publishDate: "2026-06-21"
tags: ["Cybersecurity", "ENSICAEN", "Network"]
featured: false
draft: false
---

IT security has never been as critical a topic as it is today. As I prepare to join the **Cybersecurity & E-payment** specialty at ENSICAEN, I have started consolidating my knowledge on the fundamentals of system and data protection.

Here are a few key concepts every developer should keep in mind, even outside of a purely cyber specialization.

## 1. Security by Design

It is much more costly and complex to patch security flaws once the application is in production than to prevent them during the architecture phase. Thinking "security" means validating every user input, strictly managing permissions (Principle of least privilege) and encrypting sensitive data from day one.

## 2. OWASP Top 10

For any web developer, knowing the OWASP Top 10 is essential. It lists the most critical vulnerabilities:
- **Injection (SQL, NoSQL, etc.)**
- **Broken Access Control**
- **Cryptographic Failures**

In my web projects (like with PHP or Java), I make sure to use prepared statements and systematically verify access rights on the server side.

## 3. E-payment: A world apart

E-payment, which encompasses all computer and electronic processing related to banking transactions, is a field where cybersecurity truly comes into its own. The PCI-DSS standard, for example, imposes drastic rules on how credit card numbers must be processed, encrypted, and stored (or rather, not stored).

## Heading to ENSICAEN

Joining a specialized program is an opportunity to go beyond simply applying development best practices, to intimately understand how attacks work (Penetration Testing, Reverse Engineering) and how to design resilient architectures (Advanced cryptography, network security). I look forward to sharing my upcoming discoveries on this blog!
