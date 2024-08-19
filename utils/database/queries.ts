import sql from './postgres';
import {
  Household,
  HouseholdWithLienholder,
  Lienholder,
  RecordWithRelationship,
} from '../..';

export const getHouseholdByEmail = async (
  email: string
): Promise<Household | null> => {
  const result = await sql`
  select
    h.*
  from
    "Household" h
  join "User" u on
    u."householdId" = h.id
  where
    u.email = ${email};  
  `.catch((error: any) => {
    throw new Error(error);
  });
  if (result.length) return result[0] as Household;
  return null;
};

export const getLienholderById = async (
  id: number
): Promise<Lienholder | null> => {
  const result = await sql`
  select
    *
  from
    "Lienholder" l
  where
    l.id = ${id};
  `.catch((error: any) => {
    throw new Error(error);
  });
  if (result.length) return result[0] as Lienholder;
  return null;
};

export const getHouseholdWithLienholderByEmail = async (
  email: string
): Promise<HouseholdWithLienholder | null> => {
  const result = await sql`
  select
    h.*,
    l."name"
  from
    "Household" h
  join "User" u on
    u."householdId" = h.id
  left join "Lienholder" l on
    h."lienholderId" = l.id
  where
    u.email = ${email};
  `;
  if (result.length) return result[0] as HouseholdWithLienholder;
  return null;
};

export const getRecordsWithRelationshipByEmail = async (
  email: string
): Promise<RecordWithRelationship[]> => {
  return (await sql`
  select
    r.*,
    rel.relationship as relationship
  from
    "Record" r
  join "User" u on
    u."householdId" = r."householdId"
  join "Relative" rel on
    u.id = rel."userId"
  where
    u.email = ${email};
  `) as RecordWithRelationship[];
};
