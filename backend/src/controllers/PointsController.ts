import knex from '../database/connection';
import { Request, Response, response, query } from 'express';

//padrão:
//index: exibir lista
//show: exibir unico item
//create, update, delete

class PointsController {
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    //importante utilizar transaction para caso aconteça algum erro
    // a execução vai parar e não vai executar nenhuma outra trasação

    const trx = await knex.transaction();

    const point = {
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    //quando o knex faz a inserção dos dados na tabela retorna os id que foram inseridos
    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return res.json({
      id: point_id,
      ...point,
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();
    if (!point) {
      return res.status(400).json({ message: 'point not found' });
    }

    /*
        SELECT * FROM items
        JOIN point_items ON items.id = point_items.item_id
        WHERE point_items.point_id = { id }    
    */

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return res.json({ point, items });
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    //separa a query nas vírgulas e retira os espaços
    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return res.json(points);
  }
}

export default PointsController;
