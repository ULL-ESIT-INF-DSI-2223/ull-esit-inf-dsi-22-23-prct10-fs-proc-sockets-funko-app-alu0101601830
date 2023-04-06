import chai from 'chai';
const expect = chai.expect;
import * as fs from 'fs';
import { MochilaCSV, MochilaJSON } from '../src/Mochila.js';

describe('Mochila', () => {
  describe('Extension no soportada', () =>{
    it('debe lanzar una excepcion', () =>{
      const extractorCSV = new MochilaCSV();
      expect(() => extractorCSV.procesar('src/data/prueba.txt')).to.throw('Formato de archivo no soportado.');
    })
  })
  describe('MochilaCSV', () => {
    it('debe procesar correctamente el archivo CSV', () => {
      const extractorCSV = new MochilaCSV();
      const resultadoCSV = extractorCSV.procesar('src/data/archivo.csv');
      const beneficiosEsperados = [10, 10, 5, 14, 33];
      const pesosEsperados = [20, 30, 40, 5, 4];

      expect(resultadoCSV.beneficios).to.deep.equal(beneficiosEsperados);
      expect(resultadoCSV.pesos).to.deep.equal(pesosEsperados);
    });

    it('debe lanzar un error para un archivo inexistente', () => {
      const extractorCSV = new MochilaCSV();
      expect(() => extractorCSV.procesar('src/data/inexistente.csv')).to.throw('El archivo no existe en la ruta especificada.');
    });
  });

  describe('MochilaJSON', () => {
    it('debe procesar correctamente el archivo JSON', () => {
      const extractorJSON = new MochilaJSON();
      const resultadoJSON = extractorJSON.procesar('src/data/archivo.json');
      const beneficiosEsperados = [10, 10, 5, 14, 33];
      const pesosEsperados = [20, 30, 40, 5, 4];

      expect(resultadoJSON.beneficios).to.deep.equal(beneficiosEsperados);
      expect(resultadoJSON.pesos).to.deep.equal(pesosEsperados);
    });

    it('debe lanzar un error para un archivo inexistente', () => {
      const extractorJSON = new MochilaJSON();
      expect(() => extractorJSON.procesar('src/data/inexistente.json')).to.throw('El archivo no existe en la ruta especificada.');
    });
  });
});
