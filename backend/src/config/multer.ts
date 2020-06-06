import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

//utilizar o crypto para geral um hash e somar com o nome do aquivo
//desta forma é quase impossível ter dois arquivos com o mesmo nome

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex');

      const filename = `${hash}-${file.originalname}`;
      callback(null, filename);
    },
  }),
};
