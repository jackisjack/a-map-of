﻿CREATE TABLE [dbo].[TUTODONE] (
    [IDTUTODONE]    INT      IDENTITY (1, 1) NOT NULL,
    [IDTUTO]        INT      NOT NULL,
    [IDUSER]        INT      NOT NULL,
    [DATE_CREATION] DATETIME NOT NULL,
    CONSTRAINT [PK_TUTODONE] PRIMARY KEY CLUSTERED ([IDTUTODONE] ASC),
    CONSTRAINT [FK_TUTODONE_TUTODONE] FOREIGN KEY ([IDTUTO]) REFERENCES [dbo].[TUTO] ([IDTUTO]),
    CONSTRAINT [FK_TUTODONE_USER] FOREIGN KEY ([IDUSER]) REFERENCES [dbo].[USER] ([IDUSER])
);
