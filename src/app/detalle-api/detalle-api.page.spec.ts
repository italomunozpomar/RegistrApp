import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleApiPage } from './detalle-api.page';

describe('DetalleApiPage', () => {
  let component: DetalleApiPage;
  let fixture: ComponentFixture<DetalleApiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
