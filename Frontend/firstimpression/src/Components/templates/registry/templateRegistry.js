// Structural Nodes
import PageNode from '../components/nodes/PageNode';
import ContainerNode from '../components/nodes/ContainerNode';
import RowNode from '../components/nodes/RowNode';
import ColumnsNode from '../components/nodes/ColumnsNode';
import ColumnNode from '../components/nodes/ColumnNode';
import SectionNode from '../components/nodes/SectionNode';
import TextNode from '../components/nodes/TextNode';
import HeadingNode from '../components/nodes/HeadingNode';
import ImageNode from '../components/nodes/ImageNode';
import ListNode from '../components/nodes/ListNode';
import ItemNode from '../components/nodes/ItemNode';
import DividerNode from '../components/nodes/DividerNode';
import SpacerNode from '../components/nodes/SpacerNode';
import BlockNode from '../components/nodes/BlockNode';
import UnknownNode from '../components/nodes/UnknownNode';

// Semantic Blocks
import HeaderBlock from '../components/blocks/HeaderBlock';
import SummaryBlock from '../components/blocks/SummaryBlock';
import ExperienceBlock from '../components/blocks/ExperienceBlock';
import EducationBlock from '../components/blocks/EducationBlock';
import SkillsBlock from '../components/blocks/SkillsBlock';
import ProjectsBlock from '../components/blocks/ProjectsBlock';
import CertificationsBlock from '../components/blocks/CertificationsBlock';
import LanguagesBlock from '../components/blocks/LanguagesBlock';
import CustomBlock from '../components/blocks/CustomBlock';

/**
 * Registry mapping node types to their React components
 */
const nodeRegistry = {
  page: PageNode,
  container: ContainerNode,
  row: RowNode,
  columns: ColumnsNode,
  column: ColumnNode,
  section: SectionNode,
  text: TextNode,
  heading: HeadingNode,
  image: ImageNode,
  list: ListNode,
  item: ItemNode,
  divider: DividerNode,
  spacer: SpacerNode,
  block: BlockNode,
  header: ContainerNode,
  footer: ContainerNode,
  main: ContainerNode,
};

/**
 * Registry mapping semantic block types to their React components
 */
const blockRegistry = {
  header: HeaderBlock,
  'header-block': HeaderBlock,
  summary: SummaryBlock,
  'summary-block': SummaryBlock,
  experience: ExperienceBlock,
  'experience-block': ExperienceBlock,
  education: EducationBlock,
  'education-block': EducationBlock,
  skills: SkillsBlock,
  'skills-block': SkillsBlock,
  projects: ProjectsBlock,
  'projects-block': ProjectsBlock,
  certifications: CertificationsBlock,
  'certifications-block': CertificationsBlock,
  languages: LanguagesBlock,
  'languages-block': LanguagesBlock,
  custom: CustomBlock,
  'custom-block': CustomBlock,
};

/**
 * Retrieves the React component for a given node type
 * @param {string} type
 * @returns {React.ComponentType}
 */
export function getNodeComponent(type) {
  if (!type) return UnknownNode;
  return nodeRegistry[type.toLowerCase()] || UnknownNode;
}

/**
 * Retrieves the React component for a given semantic block type
 * @param {string} blockType
 * @returns {React.ComponentType|null}
 */
export function getBlockComponent(blockType) {
  if (!blockType) return null;
  return blockRegistry[blockType.toLowerCase()] || null;
}

/**
 * Registers a new node type dynamically
 * @param {string} type
 * @param {React.ComponentType} component
 */
export function registerNodeType(type, component) {
  nodeRegistry[type.toLowerCase()] = component;
}

/**
 * Registers a new block type dynamically
 * @param {string} blockType
 * @param {React.ComponentType} component
 */
export function registerBlockType(blockType, component) {
  blockRegistry[blockType.toLowerCase()] = component;
}
