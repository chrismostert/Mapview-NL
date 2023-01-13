import { writable } from 'svelte/store';

export const csv_data = writable();
export const csv_name = writable();

export const selected_variable = writable();

export const selected_date = writable();
export const selected_date_idx = writable();

export const stat_hovered = writable();