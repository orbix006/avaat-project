import { Database } from '../types/database';

type Tables = Database['public']['Tables'];
type AdminProfileTable = Tables['profiles'];

// Test if 'profiles' is a key
type Keys = keyof Tables;
const testKey: Keys = 'profiles'; // if it's not a key, this will fail compilation!
