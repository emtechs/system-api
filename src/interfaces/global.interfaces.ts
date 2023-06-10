type IOrder = 'finished_at' | 'date' | 'created_at' | 'infreq' | 'name';

export interface IQuery {
  take?: number;
  skip?: number;
  order?: IOrder;
  by?: 'asc' | 'desc';
}
