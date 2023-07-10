type IOrder =
  | 'finished_at'
  | 'date'
  | 'created_at'
  | 'infreq'
  | 'name'
  | 'director_name'
  | 'registry'
  | 'school_name';

export interface IQuery {
  take?: number;
  skip?: number;
  order?: IOrder;
  by?: 'asc' | 'desc';
  is_active?: 'true' | 'false';
  year_id?: string;
  school_id?: string;
  class_id?: string;
}
