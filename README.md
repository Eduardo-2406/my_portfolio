# Portafolio Web Next.js + Tailwind + TypeScript

## Demo y configuración rápida

Este proyecto es una plantilla profesional lista para desplegar. Incluye:
- Portafolio moderno con animaciones y diseño responsive.
- Formulario de contacto funcional usando Resend.
- Configuración fácil por variables de entorno.

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```

---

## Configuración de variables de entorno

1. Renombra el archivo `.env.example` a `.env`:
   ```bash
   mv .env.example .env
   ```
2. Abre `.env` y coloca tus datos:
   ```env
   CONTACT_EMAIL=tu-correo@ejemplo.com
   RESEND_API_KEY=tu_api_key_de_resend
   ```

- **CONTACT_EMAIL**: Correo donde recibirás los mensajes del formulario.
- **RESEND_API_KEY**: API key de tu cuenta en [Resend](https://resend.com/).

---

## Cómo funciona el formulario de contacto

- En modo demo (sin dominio verificado en Resend), solo puedes recibir correos en el email con el que creaste la cuenta en Resend.
- Para enviar a cualquier correo:
  1. Verifica tu dominio en [Resend](https://resend.com/domains).
  2. Cambia el campo `from` en `src/app/actions.ts` por un correo de tu dominio verificado.

Ejemplo:
```js
from: "no-reply@tudominio.com"
```

---

## Personalización de redes sociales

- Edita los links de redes sociales en `src/lib/data.ts` en el objeto `socialLinks`.
- Solo cambia las URLs por las tuyas.

---

## Despliegue

Puedes desplegar en Vercel, Netlify, o cualquier hosting compatible con Next.js.


