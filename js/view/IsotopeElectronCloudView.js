// Copyright 2015-2020, University of Colorado Boulder

/**
 * Node that represents the electron shells in an isotope as a "cloud" that grows and shrinks depending on the number
 * of electrons that it contains.  This particular class implements behavior needed for the Isotopes simulation, which
 * is somewhat different from that needed for Build an Atom.  Note that the name 'IsotopeselfView' was chosen
 * in order to keep up with electron cloud naming conventions in Build an Atom (i.e. selfView,
 * ElectronShellView).
 *
 * @author John Blanco
 * @author Jesse Greenberg
 * @author Aadish Gupta
 */

import LinearFunction from '../../../dot/js/LinearFunction.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';

// constants
const MAX_ELECTRONS = 10; // For neon.

/**
 * Constructor for the Isotope Electron Cloud.
 *
 * @param {NumberAtom} numberAtom
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options]
 * @constructor
 */
function IsotopeElectronCloudView( numberAtom, modelViewTransform, options ) {

  options = merge( {
      tandem: Tandem.REQUIRED
    },
    options
  );

  options.pickable = false; // this is never allowed to be pickable

  // Call super constructor using dummy radius and actual is updated below.
  Circle.call( this, 1, options );

  // carry this through the scope
  const self = this;

  const updateNode = function( numElectrons ) {
    if ( numElectrons === 0 ) {
      self.radius = 1E-5; // Arbitrary non-zero value.
      self.fill = 'transparent';
    }
    else {
      self.radius = modelViewTransform.modelToViewDeltaX( self.getElectronShellDiameter( numElectrons ) / 2 );
      // empirically determined adjustment factor according to the weighing scale
      self.radius = self.radius * 1.2;
      self.fill = new RadialGradient( 0, 0, 0, 0, 0, self.radius )
        .addColorStop( 0, 'rgba( 0, 0, 255, 0 )' )
        .addColorStop( 1, 'rgba( 0, 0, 255, 0.4 )' );
    }
  };
  updateNode( numberAtom.electronCountProperty.get() );

  // Update the cloud size as electrons come and go.
  numberAtom.protonCountProperty.link( updateNode );

  this.disposeIsotopeElectronCloudView = function() {
    numberAtom.protonCountProperty.unlink( updateNode );
  };
}

shred.register( 'IsotopeElectronCloudView', IsotopeElectronCloudView );
inherit( Circle, IsotopeElectronCloudView, {

  // @public
  dispose: function() {
    this.disposeIsotopeElectronCloudView();
    Circle.prototype.dispose.call( this );
  },

  /**
   * Maps a number of electrons to a diameter in screen coordinates for the electron shell.  This mapping function is
   * based on the real size relationships between the various atoms, but has some tweakable parameters to reduce the
   * range and scale to provide values that are usable for our needs on the canvas.
   * @param {number} numElectrons
   * @public
   */
  getElectronShellDiameter: function( numElectrons ) {

    // This data structure maps the number of electrons to a radius for an atom.  It assumes a stable, neutral atom.
    // The basic values are the covalent radii, and were taken from a Wikipedia entry entitled "Atomic radii of the
    // elements" which, at the time of this writing, can be found here:
    // https://en.wikipedia.org/wiki/Atomic_radii_of_the_elements_(data_page).
    // The values are in picometers.  In practice, the difference between the radii worked out to be a bit too much
    // visually, so there are some 'tweak factors' for a few of the elements.
    const mapElectronCountToRadius = {
      1: 38,
      2: 32,
      3: 134 * 0.75,
      4: 90 * 0.97,
      5: 82,
      6: 77,
      7: 75,
      8: 73,
      9: 71,
      10: 69
    };

    // Determine the min and max radii of the supported atoms.
    let minShellRadius = Number.MAX_VALUE;
    let maxShellRadius = 0;

    for ( const radius in mapElectronCountToRadius ) {
      if ( radius > maxShellRadius ) {
        maxShellRadius = radius;
      }
      if ( radius < minShellRadius ) {
        minShellRadius = radius;
      }
    }

    // This method increases the value of the smaller radius values and decreases the value of the larger ones.
    // This effectively reduces the range of radii values used.
    // This is a very specialized function for the purposes of this class.
    const reduceRadiusRange = function( value ) {
      // The following two factors define the way in which an input value is increased or decreased.  These values
      // can be adjusted as needed to make the cloud size appear as desired.
      const minChangedRadius = 40;
      const maxChangedRadius = 55;

      const compressionFunction = new LinearFunction( minShellRadius, maxShellRadius, minChangedRadius, maxChangedRadius );
      return compressionFunction( value );
    };

    if ( numElectrons in mapElectronCountToRadius ) {
      return reduceRadiusRange( mapElectronCountToRadius[ numElectrons ] );
    }
    else {
      assert && assert( numElectrons <= MAX_ELECTRONS, 'Atom has more than supported number of electrons, ' + numElectrons );
      return 0;
    }
  }
} );

export default IsotopeElectronCloudView;