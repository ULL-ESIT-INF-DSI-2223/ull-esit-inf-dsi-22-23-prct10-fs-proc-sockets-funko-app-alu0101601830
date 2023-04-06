import chai from 'chai';
const expect = chai.expect;
import { Tipo, Genero, Funko } from '../src/funko.js';
import { FunkoOperations } from '../src/funkoOperations.js';
import * as fs from 'fs';
import chalk from 'chalk';


const testUsername = 'testuser';
const testUserDirectory = `./users/${testUsername}`;

describe('FunkoOperations', () => {
    beforeEach(() => {
        if (!fs.existsSync(testUserDirectory)) {
            fs.mkdirSync(testUserDirectory);
        }
    });

    afterEach(() => {
        const files = fs.readdirSync(testUserDirectory);
        files.forEach((file) => {
            fs.unlinkSync(`${testUserDirectory}/${file}`);
        });
        fs.rmdirSync(testUserDirectory);
    });

    const testFunko: Funko = {
        id: 'test_id',
        nombre: 'Test Funko',
        descripcion: 'Test description',
        tipo: Tipo.Pop,
        genero: Genero.Animacion,
        franquicia: 'Test Franchise',
        numero: 1,
        exclusivo: false,
        caracteristicasEspeciales: 'Test features',
        valorDeMercado: 25,
    };

    it('should create a new FunkoOperations instance', () => {
        const funkoOps = new FunkoOperations(testUsername);
        expect(funkoOps).to.be.instanceOf(FunkoOperations);
    });

    it('should add a new Funko', () => {
        const funkoOps = new FunkoOperations(testUsername);
        funkoOps.addFunko(testFunko, testUsername);
        expect(fs.existsSync(`${testUserDirectory}/${testFunko.id}.json`)).to.be.true;
    });

    it('getFunkoById', () => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.getFunkoById(testFunko.id, testUsername);
    });

    it('printFunkoInfo', () => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.printFunkoInfo(testFunko);
    });

    it('should show an error message when trying to add an existing Funko', (done) => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.addFunko(testFunko, testUsername);
    
      // Almacena la salida de consola en un string
      let consoleOutput = '';
      const storeLog = (message: string) => (consoleOutput += `${message}\n`);
      const consoleLogOriginal = console.log
      console['log'] = storeLog;
    
      // Intenta agregar el mismo Funko nuevamente
      funkoOps.addFunko(testFunko, testUsername);
    
      // Verifica si se llamó a console.log con el mensaje de error esperado
      expect(consoleOutput).contain(`Funko already exists at ${testUsername} collection!`);
      // Restaura la función console.log a su estado original
      console['log'] = consoleLogOriginal;
      done();
    });
    

    it('should update an existing Funko', () => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.addFunko(testFunko, testUsername);
  
      const updatedFunko: Funko = { ...testFunko, nombre: 'Updated Test Funko', valorDeMercado: 35 };
      funkoOps.updateFunko(updatedFunko, testUsername);
  
      const updatedFunkoContent = fs.readFileSync(`${testUserDirectory}/${testFunko.id}.json`, 'utf-8');
      const parsedUpdatedFunko: Funko = JSON.parse(updatedFunkoContent);
  
      expect(parsedUpdatedFunko).to.deep.equal(updatedFunko);
    });

    it('should show an error message when trying to update a non existing Funko', (done) => {
      const funkoOps = new FunkoOperations(testUsername);
    
      // Almacena la salida de consola en un string
      let consoleOutput = '';
      const storeLog = (message: string) => (consoleOutput += `${message}\n`);
      const consoleLogOriginal = console.log
      console['log'] = storeLog;
    
      // Intenta agregar el mismo Funko nuevamente
      funkoOps.updateFunko(testFunko, testUsername);
    
      // Verifica si se llamó a console.log con el mensaje de error esperado
      expect(consoleOutput).contain(`Funko not found at ${testUsername} collection!`);
    
      // Restaura la función console.log a su estado original
      console['log'] = consoleLogOriginal;
      done();
    });

    it('should delete an existing Funko', () => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.addFunko(testFunko, testUsername);

      funkoOps.deleteFunko(testFunko.id, testUsername);
      expect(fs.existsSync(`${testUserDirectory}/${testFunko.id}.json`)).to.be.false;
    });

    it('should show an error message when trying to delete a non existing Funko', (done) => {
      const funkoOps = new FunkoOperations(testUsername);
      // Almacena la salida de consola en un string
      let consoleOutput = '';
      const storeLog = (message: string) => (consoleOutput += `${message}\n`);
      const consoleLogOriginal = console.log
      console['log'] = storeLog;
      // Intenta agregar el mismo Funko nuevamente
      funkoOps.deleteFunko(testFunko.id, testUsername);
      // Verifica si se llamó a console.log con el mensaje de error esperado
      expect(consoleOutput).contain(`Funko not found at ${testUsername} collection!`);
      // Restaura la función console.log a su estado original
      console['log'] = consoleLogOriginal;
      done();
    });
    it('should list all the Funko', () => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.listFunkos(testUsername);
      funkoOps.addFunko(testFunko, testUsername)
      funkoOps.listFunkos(testUsername);

    });
    it('should list one Funko', () => {
      const funkoOps = new FunkoOperations(testUsername);
      funkoOps.addFunko(testFunko, testUsername)
      funkoOps.getFunkoById(testFunko.id,testUsername);
    });
    it('getMarketValueColor', () => {
      const funkoOps = new FunkoOperations(testUsername);
      expect(funkoOps.getMarketValueColor(10)).to.be.equal(chalk.red)
      expect(funkoOps.getMarketValueColor(25)).to.be.equal(chalk.blue)
      expect(funkoOps.getMarketValueColor(35)).to.be.equal(chalk.yellow)
      expect(funkoOps.getMarketValueColor(60)).to.be.equal(chalk.green)

    });
});

describe('Funko Enums', () => {
    it('should have correct values for Tipo enum', () => {
        expect(Tipo.Pop).to.equal('Pop!');
        expect(Tipo.PopRides).to.equal('Pop! Rides');
        expect(Tipo.VinylSoda).to.equal('Vinyl Soda');
        expect(Tipo.VinylGold).to.equal('Vinyl Gold');
    });

    it('should have correct values for Genero enum', () => {
        expect(Genero.Animacion).to.equal('Animación');
        expect(Genero.PeliculasTV).to.equal('Películas y TV');
        expect(Genero.Videojuegos).to.equal('Videojuegos');
        expect(Genero.Deportes).to.equal('Deportes');
        expect(Genero.Musica).to.equal('Música');
        expect(Genero.Anime).to.equal('Ánime');
    });
});
