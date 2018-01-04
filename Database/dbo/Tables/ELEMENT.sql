CREATE TABLE [dbo].[ELEMENT] (
    [IDELEMENT]          INT            IDENTITY (1, 1) NOT NULL,
    [IDELEMENTVUE]       INT            NOT NULL,
    [IDVUE]              INT            NOT NULL,
    [IDELEMENTVUEPARENT] INT            NOT NULL,
    [IDOBJET]            INT            NOT NULL,
    [IDTYPEOBJETVUE]     INT            NOT NULL,
    [LIBELLE]            NVARCHAR (MAX) NOT NULL,
    [X]                  INT            NOT NULL,
    [Y]                  INT            NOT NULL,
    [FORME]              INT            NOT NULL,
    [X_DELTA]            INT            NOT NULL,
    [Y_DELTA]            INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([IDELEMENT] ASC),
    CONSTRAINT [FK_ELEMENT_OBJET] FOREIGN KEY ([IDOBJET]) REFERENCES [dbo].[OBJET] ([IDOBJET]),
    CONSTRAINT [FK_ELEMENT_TYPEOBJET] FOREIGN KEY ([IDTYPEOBJETVUE]) REFERENCES [dbo].[TYPEOBJET] ([IDTYPEOBJET]),
    CONSTRAINT [FK_ELEMENT_VUE] FOREIGN KEY ([IDVUE]) REFERENCES [dbo].[VUE] ([IDVUE])
);

