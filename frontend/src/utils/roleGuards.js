// src/utils/roleGuards.js
import authService from '../services/auth.service';

// Verificações de role para componentes
export const canViewTransportadoras = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador') || 
         authService.hasRole('viewer');
};

export const canEditTransportadoras = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canDeleteTransportadoras = () => {
  return authService.hasRole('admin');
};

export const canViewClientes = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador') || 
         authService.hasRole('viewer');
};

export const canEditClientes = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canDeleteClientes = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canViewMotoristas = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canEditMotoristas = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canDeleteMotoristas = () => {
  return authService.hasRole('admin');
};

export const canViewNotasFiscais = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador') || 
         authService.hasRole('viewer');
};

export const canEditNotasFiscais = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canFinalizarNotasFiscais = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canViewRomaneios = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canEditRomaneios = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canDeleteRomaneios = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canViewOcorrencias = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador') || 
         authService.hasRole('viewer');
};

export const canEditOcorrencias = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canAccessAdmin = () => {
  return authService.hasRole('admin');
};

// Helper para verificar múltiplas permissões
export const hasAnyRole = (roles) => {
  return roles.some(role => authService.hasRole(role));
};

export const hasAllRoles = (roles) => {
  return roles.every(role => authService.hasRole(role));
};

// Verificações específicas para funcionalidades
export const canCreateRecords = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador');
};

export const canDeleteRecords = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canRestoreRecords = () => {
  return authService.hasRole('admin');
};

export const canViewReports = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor') || 
         authService.hasRole('operador') || 
         authService.hasRole('viewer');
};

export const canExportData = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export const canImportData = () => {
  return authService.hasRole('admin') || 
         authService.hasRole('gestor');
};

export default {
  canViewTransportadoras,
  canEditTransportadoras,
  canDeleteTransportadoras,
  canViewClientes,
  canEditClientes,
  canDeleteClientes,
  canViewMotoristas,
  canEditMotoristas,
  canDeleteMotoristas,
  canViewNotasFiscais,
  canEditNotasFiscais,
  canFinalizarNotasFiscais,
  canViewRomaneios,
  canEditRomaneios,
  canDeleteRomaneios,
  canViewOcorrencias,
  canEditOcorrencias,
  canAccessAdmin,
  hasAnyRole,
  hasAllRoles,
  canCreateRecords,
  canDeleteRecords,
  canRestoreRecords,
  canViewReports,
  canExportData,
  canImportData
};