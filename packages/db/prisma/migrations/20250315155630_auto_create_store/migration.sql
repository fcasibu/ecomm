INSERT INTO "Store" ("id", "currency", "locale", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'USD',
    'en-US',
    NOW(),
    NOW()
)
ON CONFLICT ("locale") DO NOTHING;
