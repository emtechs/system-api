type IOrder =
  | 'finished_at'
  | 'date'
  | 'created_at'
  | 'infreq'
  | 'name'
  | 'director_name'
  | 'registry';

export interface IQuery {
  take?: number;
  skip?: number;
  order?: IOrder;
  by?: 'asc' | 'desc';
}
