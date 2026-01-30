import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uudi } from 'uuid'
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
    // {
    //   id: uudi(),
    //   name: 'toyota',
    //   createdAt: new Date().getTime(),
    // }
  ];
  create(createBrandDto: CreateBrandDto) {
    const brand: Brand={
      id:uudi(),
      name:createBrandDto.name.toLocaleLowerCase(),
      createdAt: new Date().getTime(),
    }

    return this.brands.push(brand);
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find(brand => brand.id === id);

    if(!brand) throw new NotFoundException(`No se encontro el id ${id}`)
    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {

    let brandDB = this.findOne(id)
    this.brands = this.brands.map(brand =>{
      if (brand.id === id){
        brandDB.updatedA=new Date().getTime();
        brandDB={...brand,...updateBrandDto}
        return brandDB
      }
      return brand;
    })
    return brandDB
  }

  remove(id: string) {
    this.findOne(id);
    this.brands = this.brands.filter( brand => brand.id !== id);
  }

   fillBransWithSeedData(brands:Brand[]){
          this.brands=brands;
      }
}
