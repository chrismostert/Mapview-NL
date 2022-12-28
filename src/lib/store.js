import { writable } from 'svelte/store';

export const csv_data = writable();
export const csv_name = writable();

export const min_value = writable();
export const max_value = writable();

export const selected_variable = writable();
export const selected_date = writable();
export const selected_data = writable();