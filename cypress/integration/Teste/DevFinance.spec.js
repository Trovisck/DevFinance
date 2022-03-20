/// <reference types="cypress" />


describe('dev finance', () => {
    //Testes no site dev finance
    const entrada = 'Venda de um software'
    const entrada2 = 'prestação de serviço'
    const saida1 = 'compra de um curso'
    const entradaEditada ='Venda de um carro'
    it('Verificar status code=200', () => {
        cy.request({
            method: 'GET',
            url: 'https://maratona-discover-devfinance.netlify.app/'
        }).then((response) => {
            expect(response.status).to.equal(200);
        })
    })

    it('cadastrar entradas validas', () => {
        // preencher todos os campos e cadastrar as informações
        cy.visit('');
        cy.get('#transactions > .button').click();                            //clicar no botão de 'nova transação'
        cy.get('#description').type(entrada);                  //adicionar ma descrição
        cy.get('#amount').type('27');                                          //adicionar valor da ocorrencia
        cy.get('#date').type('2001-02-12');                                    // data da ocorrencia
        cy.get('button').click();                                             // clicar em salvar
        cy.get('.data-table__description').should('have.length', 1);   // validar se o número de linhas é =  1
        cy.get('.card__amount').contains('R$ 27,00');
    });

    it('Cadastrar entradas sem valor', () => {
        // preencher todos os campos e deixar o campo valor sem preenhimento, validar a mensagem que aparece
        cy.visit('');
        cy.get('#transactions > .button').click();
        cy.get('#description').type(entrada);
        cy.get('#date').type('2001-02-12');
        cy.get('button').click();
        cy.on('window:alert', (str) => {                 // validar o alerta com a frase "porfavor preencha todos os campos".
            expect(str).to.equal('Porfavor preencha todos os campos');
        })


    });
    
    it('Cadastrar entradas sem data', () => {
        cy.visit('');
        cy.get('#transactions > .button').click();
        cy.get('#description').type(entrada);
        cy.get('#amount').type('27'); 
        cy.get('button').click();
        cy.on('window:alert', (str) => {                 // validar o alerta com a frase "porfavor preencha todos os campos".
            expect(str).to.equal('Porfavor preencha todos os campos');
        })
        
    });
    it('Cadastrar entrada sem descrição', () => {
        cy.visit('');
        cy.get('#transactions > .button').click();
        cy.get('#amount').type('27'); 
        cy.get('#date').type('2001-02-12');
        cy.get('button').click();
        cy.on('window:alert', (str) => {                 // validar o alerta com a frase "porfavor preencha todos os campos".
            expect(str).to.equal('Porfavor preencha todos os campos');
        })
        
    });
    it('Cadastrar entrada com data futura', () => {
        cy.visit('');
        cy.get('#transactions > .button').click();                            
        cy.get('#description').type(entrada);                 
        cy.get('#amount').type('27');                                          
        cy.get('#date').type('2025-02-12');                                    
        cy.get('button').click();                                             
        cy.get('.data-table__description').should('have.length', 1);   
        cy.get('.card__amount').contains('R$ 27,00');
        
    });
    it('Cadastrar Entreada com caracteres no campo valor', () => {
        cy.visit('');
        cy.get('#transactions > .button').click();                            
        cy.get('#description').type(entrada);                 
        cy.get('#amount').type('@!@#$%%¨¨&*()27!@#$%¨¨cxccbiugsdfobcvoigeubcisugiugrjibcsjvbouedgodkd');                                          
        cy.get('#date').type('2005-02-12');                                    
        cy.get('button').click();                                             
        cy.get('.data-table__description').should('have.length', 1);   
        cy.get('.card__amount').contains('R$ 27,00');
        // aqui percebemos que se for digitado diversos caracteres no campo valor somento fica cadastrado os digitos
        
    });
    it('cadastrar entradas com diversos simbolos no campo descrição', () => {
        
        cy.visit('');
        cy.get('#transactions > .button').click();                          
        cy.get('#description').type("!@##%$¨&*(%))_¨*#)$*$(%*Nbchydsownouhfo5421879hfguhguhrughr^`OIJUYFTDRDTD$EW#W%$E%¨R*¨T*&T(*YT&*%Ë#W@EDRCYVTFYT341642757945487642174579459754975497547415412545124");                  
        cy.get('#amount').type('27');                                          
        cy.get('#date').type('2001-02-12');                                   
        cy.get('button').click();                                             
        cy.get('.data-table__description').should('have.length', 1);   
        cy.get('.card__amount').contains('R$ 27,00');
        cy.contains('!@##%$¨&*(%))_¨*#)$*$(%*Nbchydsownouhfo5421879hfguhguhrughr^`OIJUYFTDRDTD$EW#W%$E%¨R*¨T*&T(*YT&*%Ë#W@EDRCYVTFYT341642757945487642174579459754975497547415412545124')
    });
    it('cadastrar saidas', () => {
        cy.visit('');
        cy.get('#transactions > .button').click();//clicar no botão de 'nova transação'
        cy.get('#description').type(saida1);//adicionar ma descrição
        cy.get('#amount').type('-25');//adicionar valor da ocorrencia
        cy.get('#date').type('2001-03-12');// data da ocorrencia
        cy.get('button').click();// clicar em salvar
        cy.get('.data-table__description').should('have.length', 1);// validar se o número de colunas é = a 2 
        cy.get('.card__amount').contains('-R$ 25,00'); // validar que o valor final foi igual a 2 
    });
    it('Remover Entradas e saídas', () => {
        cy.visit('');
        //adicionando entrada
        cy.get('#transactions > .button').click();
        cy.get('#description').type(entrada);
        cy.get('#amount').type('100');
        cy.get('#date').type('2001-02-12');
        cy.get('button').click();
        cy.get('.data-table__description').should('have.length', 1);
        // adicionando saida
        cy.get('#transactions > .button').click();
        cy.get('#description').type(saida1);
        cy.get('#amount').type('-35');
        cy.get('#date').type('2001-03-12');
        cy.get('button').click();
        cy.get('.data-table__description').should('have.length', 2);
        // removendo entrada
        cy.contains(entrada);
        cy.get('[onclick="Transaction.remove(0)"]').click();
        cy.get('.data-table__description').should('have.length', 1);
        // removendo saida
        cy.contains(saida1);
        cy.get('[onclick="Transaction.remove(0)"]').click();
        cy.get('.data-table__description').should('have.length', 0);
    });

    it('Editar dados', () => {
        cy.visit('')
        //entrada 1
        cy.get('#transactions > .button').click();
        cy.get('#description').type(entrada);
        cy.get('#amount').type('100');
        cy.get('#date').type('2001-02-12');
        cy.get('button').click();
        cy.get('.data-table__description').should('have.length', 1);

        //entrada 2

        cy.get('#transactions > .button').click();
        cy.get('#description').type(entrada2);
        cy.get('#amount').type('200');
        cy.get('#date').type('2002-02-12');
        cy.get('button').click();
        cy.get('.data-table__description').should('have.length', 2);

        //edição data da entrada 1
        cy.contains(entrada)//verificar se tenho a palavra a variavel entrada
        cy.get('[data-index="0"] > :nth-child(4) > .data-table-edit').click();
        cy.get('#date').type('2023-02-12');
        cy.get('button').click();
        cy.get('.data-table__description').should('have.length', 2);
        //validação de todos os elementos
        cy.get('[data-index="0"] > .data-table__price-income').contains('R$ 100,00');
        cy.contains('12/02/2023');
        cy.contains(entrada);

        // editar descrição
        cy.contains(entrada2);//verificar se tenho a palavra entrada
        cy.get('[data-index="1"] > :nth-child(4) > .data-table-edit').click();
        cy.get('#description').clear();
        cy.get('#description').type(entradaEditada);
        cy.get('button').click();
       // editar valor
       cy.contains(entradaEditada)//verificar se tenho a palavra entrada
       cy.get('[data-index="1"] > :nth-child(4) > .data-table-edit').click();
       cy.get('#amount').clear();
       cy.get('#amount').type('250');
       cy.get('button').click();
       cy.contains('R$ 250');
        
    });

    
});