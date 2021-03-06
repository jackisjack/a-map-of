﻿CREATE TABLE [dbo].[LIEN] (
    [IDOBJET1]         INT            NULL,
    [IDOBJET2]         INT            NULL,
    [DATE_CREATION]    DATE           NULL,
    [DATE_SUPPRESSION] DATE           NULL,
    [IDLIEN]           INT            IDENTITY (1, 1) NOT NULL,
    [COMMENTAIRE]      NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_LIEN] PRIMARY KEY CLUSTERED ([IDLIEN] ASC),
    CONSTRAINT [FK_LIEN_OBJET] FOREIGN KEY ([IDOBJET1]) REFERENCES [dbo].[OBJET] ([IDOBJET]),
    CONSTRAINT [FK_LIEN_OBJET1] FOREIGN KEY ([IDOBJET2]) REFERENCES [dbo].[OBJET] ([IDOBJET])
);

