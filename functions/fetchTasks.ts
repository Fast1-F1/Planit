import { supabase } from '@/utils/supabase';

export const fetchTasks = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user?.id);

    if (error) {
      console.log(error);
    }

    return data;
  } catch (error) {
    throw new Error('Failed while fetching tasks');
  }
};

export const createTasks = async ({
  title,
  description,
  dueDate,
  dueTime,
  status,
}: {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: string;
}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('User is not logged in');

  const { data, error: insertError } = await supabase
    .from('tasks')
    .insert([
      {
        title,
        description,
        due_date: dueDate,
        due_time: dueTime,
        status,
        user_id: user.id,
      },
    ])
    .select();

  if (insertError)
    throw new Error(`Task creation failed: ${insertError.message}`);

  return data;
};

export const updateTasks = async ({
  id,
  title,
  description,
  dueDate,
  dueTime,
  status,
  onComplete,
}: {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: string;
  onComplete: boolean;
}) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error('User is not logged in');

  const { data, error: insertError } = await supabase
    .from('tasks')
    .update({ title, description, dueDate, dueTime, status, onComplete })
    .then();
};
