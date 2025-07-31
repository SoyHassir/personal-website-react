import { createGzip, createDeflate, createBrotliCompress } from 'zlib';
import { pipeline } from 'stream/promises';

// Middleware de compresión personalizado para Vite
export const compressionMiddleware = (req, res, next) => {
  // Solo comprimir archivos de texto
  const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.xml', '.txt'];
  const isTextFile = textExtensions.some(ext => req.url.includes(ext));
  
  if (!isTextFile) {
    return next();
  }
  
  // Verificar si el cliente acepta compresión
  const acceptEncoding = req.headers['accept-encoding'] || '';
  let compression = null;
  let encoding = '';
  
  if (acceptEncoding.includes('br')) {
    compression = createBrotliCompress();
    encoding = 'br';
  } else if (acceptEncoding.includes('gzip')) {
    compression = createGzip();
    encoding = 'gzip';
  } else if (acceptEncoding.includes('deflate')) {
    compression = createDeflate();
    encoding = 'deflate';
  }
  
  if (!compression) {
    return next();
  }
  
  // Configurar headers de compresión
  res.setHeader('Content-Encoding', encoding);
  res.setHeader('Vary', 'Accept-Encoding');
  
  // Interceptar la respuesta y comprimir
  const originalSend = res.send;
  res.send = function(data) {
    if (typeof data === 'string' || Buffer.isBuffer(data)) {
      pipeline(
        Buffer.isBuffer(data) ? Buffer.from(data) : Buffer.from(data, 'utf8'),
        compression,
        res
      ).catch(err => {
        console.error('Error en compresión:', err);
        originalSend.call(this, data);
      });
    } else {
      originalSend.call(this, data);
    }
  };
  
  next();
};

// Configuración para diferentes tipos de archivos
export const compressionConfig = {
  // Configuración para JavaScript
  js: {
    level: 6,
    memLevel: 8
  },
  // Configuración para CSS
  css: {
    level: 6,
    memLevel: 8
  },
  // Configuración para HTML
  html: {
    level: 5,
    memLevel: 6
  }
}; 