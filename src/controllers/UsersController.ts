import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import * as Yup from 'yup';

import * as bcript from 'bcryptjs';

import * as jwt from 'jsonwebtoken';

export default {

    async create(request: Request, response: Response) {

        const {
            email,
            password
        } = request.body // quem vou pegar da requisição.

        const usersRepository = getRepository(User);

        const data = {
            email,
            password,
            created_at: Date.now()
        }

        // esquema de validação
        const schema = Yup.object().shape({

            email: Yup.string().required().email(),
            password: Yup.string().required().min(6),
            created_at: Yup.number()

        });

        await schema.validate(data, { // Valida
            abortEarly: false
        })

        // criptografa a senha com bcrypt
        data.password = await bcript.hash(password, 8);

        if (await usersRepository.findOne({ email })) {

            return response.status(400).json({ error: "Email já existe." });
        }

        const user = usersRepository.create(data);

        await usersRepository.save(user);

        return response.status(201).json(user);



    },

    async auth(request: Request, response: Response) {

        try {
            const { email, password } = request.body;

            const usersRepository = getRepository(User);

            const user = await usersRepository.findOne({ email });

            if (!user) {
                return response.status(400).json({ error: 'usuario não encontrado' })
            }

            // MELHORAR ISSO DEPOIS
            if (!(await compareHash(password, user.password))) {
                return response.status(400).json({ error: 'Senha Invalida'});
            }


            return response.status(200).json({
                token: generateToken(user.id, user.email)
            });

        } catch (err) {
            return response.status(400).json({ error: 'Autenticação falhou' })
        }

    },



    // Para deletar as Massas Opcional
    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const usersRepository = getRepository(User);

        const userDeletado = await usersRepository.delete(id);

        return response.status(200).json({ message: 'Deletado' })
    }

}

// Para comparar HASH

function compareHash(hash: string, password: string) {
    return bcript.compare(hash, password);
}


// PARA GERAR O TOKEN, PRECISAMOS APRENDER A MELHORAR ISSO.
function generateToken(id: number, email: string) {
    return jwt.sign({ id, email}, 'secret', {
        expiresIn: 86400
    })
}