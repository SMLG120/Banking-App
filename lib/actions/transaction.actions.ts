"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_TABLES_ID: TRANSACTION_TABLES_ID,
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const { tablesDb } = await createAdminClient();

    const newTransaction = await tablesDb.createRow({
      databaseId: DATABASE_ID!,
      tableId: TRANSACTION_TABLES_ID!,
      rowId: ID.unique(),
      data: {
        channel: 'online',
        category: 'Transfer',
        ...transaction
      }
    })
    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const { tablesDb } = await createAdminClient();

    const senderTransactions = await tablesDb.listRows({
      databaseId: DATABASE_ID!,
      tableId: TRANSACTION_TABLES_ID!,
      queries: [Query.equal('senderBankId', bankId)],
    })

    const receiverTransactions = await tablesDb.listRows({
      databaseId: DATABASE_ID!,
      tableId: TRANSACTION_TABLES_ID!,
      queries: [Query.equal('receiverBankId', bankId)],
    });


    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      tables: [
        ...senderTransactions.rows,
        ...receiverTransactions.rows,
      ]
    }

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
}